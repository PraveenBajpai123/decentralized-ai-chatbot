"use client";

import { useState, useRef, useEffect } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIBattleChatProps {
    client: Client;
    publicKey: string;
    battleData: {
        player1: string;
        player2: string;
        nft1ImageUri: string;
        nft2ImageUri: string;
    };
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const MAX_CHAT_REQUESTS = 10;

const AIBattleChat = ({
    client,
    publicKey,
    battleData,
    onTransaction
}: AIBattleChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatCount, setChatCount] = useState(0);
    const [selections, setSelections] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [gameCompleted, setGameCompleted] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (chatCount >= MAX_CHAT_REQUESTS && !gameCompleted) {
            // Calculate winner based on selections
            const nft1Count = selections.filter(s => s === 'NFT1').length;
            const nft2Count = selections.filter(s => s === 'NFT2').length;

            if (nft1Count > nft2Count) {
                setWinner(battleData.player1);
            } else if (nft2Count > nft1Count) {
                setWinner(battleData.player2);
            } else {
                // Tie - default to player1
                setWinner(battleData.player1);
            }
            setGameCompleted(true);
        }
    }, [chatCount, selections, gameCompleted, battleData]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || isLoading || chatCount >= MAX_CHAT_REQUESTS) {
            return;
        }

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setChatCount(prev => prev + 1);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    imageUri1: battleData.nft1ImageUri,
                    imageUri2: battleData.nft2ImageUri,
                    chatHistory: messages,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get AI response');
            }

            const assistantMessage: Message = { role: 'assistant', content: data.text };
            setMessages(prev => [...prev, assistantMessage]);

            // Track selection
            if (data.selection) {
                setSelections(prev => [...prev, data.selection]);
            }
        } catch (error: any) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: `Error: ${error.message || 'Failed to get response'}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaimNft = async () => {
        if (!winner) return;

        const winnerAddress = winner;
        const promise = client.claim_nft({
            recipient: winnerAddress,
            nft1_image_uri: battleData.nft1ImageUri,
            nft2_image_uri: battleData.nft2ImageUri,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "NFTs claimed successfully!");
    };

    const handleStoreGameInfo = async () => {
        if (!winner) return;

        const promise = client.game_info({
            player1: battleData.player1,
            player2: battleData.player2,
            nft1_image_uri: battleData.nft1ImageUri,
            nft2_image_uri: battleData.nft2ImageUri,
            winner: winner,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Game info stored successfully!");
    };

    const remainingChats = MAX_CHAT_REQUESTS - chatCount;
    const nft1Count = selections.filter(s => s === 'NFT1').length;
    const nft2Count = selections.filter(s => s === 'NFT2').length;

    return (
        <Card className="bg-gray-800 border-gray-700 flex flex-col h-[800px]">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">AI Battle Chat</CardTitle>
                <CardDescription className="text-gray-400">
                    Chat with AI to help it choose the winner. {remainingChats > 0 ? `${remainingChats} chat${remainingChats !== 1 ? 's' : ''} remaining` : 'Battle Complete!'}
                </CardDescription>
                {selections.length > 0 && (
                    <div className="mt-2 text-sm text-gray-300">
                        <p>NFT 1 votes: {nft1Count} | NFT 2 votes: {nft2Count}</p>
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                            <p>Start chatting with the AI judge!</p>
                            <p className="text-sm mt-2">The AI will choose between the two NFTs after each message.</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-700 text-gray-100'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-700 rounded-lg p-3">
                                <p className="text-gray-400">AI is thinking...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Winner Display and Actions */}
                {gameCompleted && winner && (
                    <div className="mb-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">🏆 Winner Decided!</h3>
                        <p className="text-white mb-1">
                            <span className="font-semibold">Winner:</span> {winner}
                        </p>
                        <p className="text-sm text-gray-300 mb-4">
                            Final Score: NFT 1 ({nft1Count}) vs NFT 2 ({nft2Count})
                        </p>
                        <div className="space-y-2">
                            <Button
                                onClick={handleClaimNft}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                Claim NFTs
                            </Button>
                            {/* <Button
                                onClick={handleStoreGameInfo}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Store Game Info
                            </Button> */}
                        </div>
                    </div>
                )}

                {/* Input Form */}
                {!gameCompleted && (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={remainingChats > 0 ? `Type your message (${remainingChats} remaining)...` : "Battle complete!"}
                            disabled={isLoading || chatCount >= MAX_CHAT_REQUESTS}
                            className="bg-gray-700 text-white border-gray-600 flex-1"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim() || chatCount >= MAX_CHAT_REQUESTS}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Send
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export default AIBattleChat;

