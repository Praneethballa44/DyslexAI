import React, { useState, useEffect } from 'react';
import { aiComicService } from '../services/ai-comic.service';

interface ComicModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedText: string;
}

export const ComicModal: React.FC<ComicModalProps> = ({ isOpen, onClose, selectedText }) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && selectedText) {
            generateComic();
        }
    }, [isOpen, selectedText]);

    const generateComic = async () => {
        setLoading(true);
        const svg = await aiComicService.generateComic(selectedText);
        setSvgContent(svg);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-cream rounded-2xl shadow-glow-lg border-2 border-primary-500 w-[90vw] max-w-5xl overflow-hidden transform animate-scale-in">

                {/* Header */}
                <div className="bg-charcoal px-6 py-4 flex justify-between items-center border-b border-primary-500/20">
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🍌</span>
                        <h2 className="text-cream font-dyslexic text-xl font-bold tracking-wide">Nano Banana Comic Mode</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-primary-300 hover:text-white transition-colors text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-cream relative">
                    {loading ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-charcoal font-dyslexic animate-pulse-soft">Dreaming up a metaphor...</p>
                        </div>
                    ) : (
                        svgContent && (
                            <div
                                className="w-full h-full flex items-center justify-center animate-slide-up"
                                dangerouslySetInnerHTML={{ __html: svgContent }}
                            />
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="bg-white/50 px-6 py-4 flex justify-between items-center border-t border-primary-500/10">
                    <p className="text-charcoal/60 text-sm font-sans truncate max-w-md">"{selectedText}"</p>
                    <div className="flex space-x-3">
                        <button
                            onClick={generateComic}
                            className="px-4 py-2 rounded-lg bg-surface-200 hover:bg-surface-300 text-charcoal font-bold transition-colors shadow-sm"
                        >
                            Regenerate
                        </button>
                        <button
                            onClick={() => {
                                if (!svgContent) return;

                                const canvas = document.createElement('canvas');
                                canvas.width = 1200;
                                canvas.height = 400;
                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;

                                const img = new Image();
                                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                                const url = URL.createObjectURL(svgBlob);

                                img.onload = () => {
                                    ctx.drawImage(img, 0, 0);
                                    URL.revokeObjectURL(url);

                                    const link = document.createElement('a');
                                    link.download = 'nano-banana-comic.png';
                                    link.href = canvas.toDataURL('image/png');
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                };

                                img.src = url;
                            }}
                            className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold transition-colors shadow-glow"
                        >
                            Save PNG
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
