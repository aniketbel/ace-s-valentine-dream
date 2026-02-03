import { useEffect, useRef, useState, useCallback } from "react";

interface MusicControllerProps {
  isPlaying: boolean;
  onAudioData?: (amplitude: number) => void;
}

// Romantic piano music - royalty free background music URL
const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3?filename=romantic-piano-143579.mp3";

const MusicController = ({ isPlaying, onAudioData }: MusicControllerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number>();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio
  const initAudio = useCallback(() => {
    if (isInitialized) return;

    const audio = new Audio(MUSIC_URL);
    audio.crossOrigin = "anonymous";
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    // Create audio context for analysis
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;
    } catch (error) {
      console.log("Audio analysis not available");
    }

    setIsInitialized(true);
  }, [isInitialized]);

  // Analyze audio for visual sync
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !onAudioData) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average amplitude
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedAmplitude = average / 255;

    onAudioData(normalizedAmplitude);

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [onAudioData]);

  // Play/pause handling
  useEffect(() => {
    if (!isPlaying) return;

    initAudio();

    const playMusic = async () => {
      if (!audioRef.current) return;

      try {
        // Resume audio context if suspended
        if (audioContextRef.current?.state === "suspended") {
          await audioContextRef.current.resume();
        }

        await audioRef.current.play();

        // Fade in volume
        let volume = 0;
        const fadeIn = setInterval(() => {
          volume += 0.02;
          if (audioRef.current) {
            audioRef.current.volume = Math.min(volume, 0.6);
          }
          if (volume >= 0.6) {
            clearInterval(fadeIn);
          }
        }, 100);

        // Start audio analysis
        analyzeAudio();
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    };

    playMusic();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, initAudio, analyzeAudio]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return null; // This is a controller component, no UI
};

export default MusicController;
