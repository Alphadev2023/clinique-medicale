// src/features/chat/components/ChatInput.tsx

import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { chatService } from "../chatService";

interface ChatInputProps {
  onSend: (contenu: string, imageUrl?: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [texte, setTexte] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleEnvoyer() {
    if (!texte.trim()) return;
    onSend(texte.trim());
    setTexte("");
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await chatService.uploaderImage(file);
      onSend(texte.trim(), url);
      setTexte("");
    } catch {
      window.alert("Échec de l'envoi de l'image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-2 py-1.5 focus-within:border-primary-600 focus-within:bg-white">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          aria-label="Joindre une image"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Paperclip className="h-5 w-5" />
          )}
        </button>
        <input
          type="text"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEnvoyer();
          }}
          placeholder="Écrire un message..."
          disabled={disabled}
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={handleEnvoyer}
          disabled={disabled || !texte.trim()}
          className="shrink-0 rounded-full bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
          aria-label="Envoyer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
