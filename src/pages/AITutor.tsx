import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Camera, X, Mic, ArrowLeft, RefreshCw, PhoneOff } from "lucide-react";
import { GoogleGenAI, Modality } from "@google/genai";
import Webcam from "react-webcam";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = "你现在是'小烨学姐'，一位温柔、耐心、专业的艺术学考研辅导学姐。你已经熟读并掌握了《艺术学概论》（彭吉象、王宏建等版本）、中外美术史、艺术理论等所有核心考研资料和历年真题数据库。你的任务是解答学弟学妹们的专业问题，提供背诵技巧、答题框架，并在他们焦虑时给予心理安抚和鼓励。回答要严谨、准确、有条理，符合考研答题规范，同时语气要亲切自然。";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  image?: string;
}

// Audio Helpers for Live API
function floatTo16BitPCM(float32Array: Float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function pcm16ToFloat32(buffer: ArrayBuffer) {
  const int16Array = new Int16Array(buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
  }
  return float32Array;
}

export default function AITutor() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "你好！我是你的考研辅导**小烨学姐**。我已经载入了《艺术学概论》及历年真题核心数据库。\n\n你可以向我提问专业知识，或者拍下不懂的题目发给我。如果你想直接和我语音交流，可以点击下方的麦克风按钮哦！"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Mode States
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() && !capturedImage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      image: capturedImage || undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setCapturedImage(null);
    setIsLoading(true);

    try {
      const parts: any[] = [];
      if (newMessage.image) {
        const base64Data = newMessage.image.split(",")[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg",
          },
        });
      }
      if (newMessage.text) {
        parts.push({ text: newMessage.text });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: response.text || "抱歉，我没有理解你的意思。",
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: "抱歉，网络似乎开小差了，请稍后再试。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowCamera(false);
    }
  };

  const startVoiceSession = async () => {
    setIsVoiceMode(true);
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      nextPlayTimeRef.current = audioContextRef.current.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
          channelCount: 1,
          sampleRate: 16000,
      } });
      streamRef.current = stream;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
          onopen: () => {
            setIsLiveConnected(true);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = floatTo16BitPCM(inputData);
              const base64 = arrayBufferToBase64(pcm16);
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  media: { data: base64, mimeType: "audio/pcm;rate=16000" }
                });
              }).catch(console.error);
            };
          },
          onmessage: (message: any) => {
            if (message.serverContent?.interrupted) {
              nextPlayTimeRef.current = audioContextRef.current?.currentTime || 0;
            }
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              playAudioChunk(audioData, audioContextRef.current);
            }
          },
          onclose: () => {
            stopVoiceSession();
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            stopVoiceSession();
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error("Failed to start voice session:", err);
      stopVoiceSession();
    }
  };

  const stopVoiceSession = () => {
    setIsVoiceMode(false);
    setIsLiveConnected(false);
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (sessionRef.current) {
      sessionRef.current.then((s: any) => s.close()).catch(console.error);
    }
  };

  const playAudioChunk = (base64Str: string, ctx: AudioContext) => {
    const buffer = base64ToArrayBuffer(base64Str);
    const float32Data = pcm16ToFloat32(buffer);
    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    const playTime = Math.max(ctx.currentTime, nextPlayTimeRef.current);
    source.start(playTime);
    nextPlayTimeRef.current = playTime + audioBuffer.duration;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-art-bg shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-art-surface/80 backdrop-blur-md z-10 border-b border-art-border sticky top-0">
        <button onClick={() => { stopVoiceSession(); navigate(-1); }} className="p-2 text-art-primary hover:bg-art-bg rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-lg font-serif font-semibold text-art-primary">小烨学姐</h1>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            艺术概论数据库已载入
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      {isVoiceMode ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-art-surface p-6">
          <motion.div
            animate={{ scale: isLiveConnected ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-32 h-32 rounded-full bg-art-primary/10 flex items-center justify-center mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-art-primary text-white flex items-center justify-center text-4xl font-serif shadow-lg">
              烨
            </div>
          </motion.div>
          <h3 className="text-2xl font-serif font-semibold text-art-primary mb-2">小烨学姐</h3>
          <p className="text-art-muted mb-16 font-medium">
            {isLiveConnected ? "正在聆听..." : "连接中..."}
          </p>
          <button
            onClick={stopVoiceSession}
            className="w-16 h-16 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors active:scale-95"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      ) : (
        <>
          {/* Chat Area */}
          <main className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  msg.role === "user" ? "self-end items-end" : "self-start items-start"
                )}
              >
                {msg.image && (
                  <div className="mb-2 rounded-2xl overflow-hidden border-2 border-art-surface shadow-sm w-48">
                    <img src={msg.image} alt="Uploaded" className="w-full h-auto object-cover" />
                  </div>
                )}
                {msg.text && (
                  <div className={cn(
                    "px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed",
                    msg.role === "user" 
                      ? "bg-art-primary text-white rounded-br-sm" 
                      : "bg-art-surface border border-art-border text-art-text rounded-bl-sm"
                  )}>
                    {msg.role === "model" ? (
                      <div className="markdown-body prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                )}
                <span className="text-[10px] text-art-muted mt-1 px-1">
                  {msg.role === "user" ? "你" : "小烨学姐"}
                </span>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="self-start bg-art-surface border border-art-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2"
              >
                <RefreshCw size={16} className="text-art-primary animate-spin" />
                <span className="text-xs text-art-muted">正在翻阅教材与真题...</span>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </main>

          {/* Camera Modal */}
          {showCamera && (
            <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
              <button 
                onClick={() => setShowCamera(false)}
                className="absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={28} />
              </button>
              <div className="w-full max-w-sm aspect-[3/4] bg-black rounded-3xl overflow-hidden relative">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "environment" }}
                  className="w-full h-full object-cover"
                  disablePictureInPicture={true}
                  forceScreenshotSourceSize={false}
                  imageSmoothing={true}
                  mirrored={false}
                  onUserMedia={() => {}}
                  onUserMediaError={() => {}}
                  screenshotQuality={0.92}
                />
                {/* Target overlay */}
                <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-2xl pointer-events-none" />
              </div>
              <button
                onClick={capture}
                className="mt-8 w-16 h-16 bg-white rounded-full border-4 border-art-primary shadow-[0_0_0_4px_rgba(255,255,255,0.5)] active:scale-95 transition-transform"
              />
              <p className="text-white/70 text-sm mt-4">请将题目或笔记对准取景框</p>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-art-surface border-t border-art-border p-3 pb-safe">
            {capturedImage && (
              <div className="relative inline-block mb-3 ml-2">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-art-primary shadow-sm">
                  <img src={capturedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={() => setCapturedImage(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5 shadow-md hover:bg-rose-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 bg-art-bg border border-art-border rounded-2xl flex items-end p-1 shadow-inner focus-within:border-art-primary/50 focus-within:ring-1 focus-within:ring-art-primary/20 transition-all">
                <button 
                  onClick={() => setShowCamera(true)}
                  className="p-2.5 text-art-muted hover:text-art-primary transition-colors shrink-0"
                >
                  <Camera size={20} />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="提问专业知识，或倾诉考研压力..."
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-1 text-sm max-h-32 min-h-[40px] outline-none"
                  rows={1}
                />
                <button 
                  onClick={startVoiceSession}
                  className="p-2.5 text-art-muted hover:text-art-primary transition-colors shrink-0"
                  title="语音通话"
                >
                  <Mic size={20} />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={(!input.trim() && !capturedImage) || isLoading}
                className="p-3 bg-art-primary text-white rounded-2xl shadow-md hover:bg-art-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shrink-0 h-[46px] w-[46px] flex items-center justify-center"
              >
                <Send size={20} className="ml-0.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
