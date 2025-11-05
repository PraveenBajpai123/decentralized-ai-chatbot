"use client";

import { useState, useEffect } from "react";
import { Client } from "@/index";
import SetupBattle from "./SetupBattle";
import AIBattleChat from "./AIBattleChat";

interface AIBattleProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const AIBattle = ({ client, publicKey, onTransaction }: AIBattleProps) => {
    const [battleSetup, setBattleSetup] = useState<{
        player1: string;
        player2: string;
        nft1ImageUri: string;
        nft2ImageUri: string;
    } | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('battleSetup');
        if (saved) {
            try {
                setBattleSetup(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved battle setup:', e);
            }
        }
    }, []);

    const handleSetupComplete = (data: {
        player1: string;
        player2: string;
        nft1ImageUri: string;
        nft2ImageUri: string;
    }) => {
        setBattleSetup(data);
    };

    const handleReset = () => {
        localStorage.removeItem('battleSetup');
        setBattleSetup(null);
    };

    if (!battleSetup) {
        return <SetupBattle onSetupComplete={handleSetupComplete} />;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">AI Battle in Progress</h2>
                <button
                    onClick={handleReset}
                    className="text-sm text-gray-400 hover:text-white underline"
                >
                    Reset Battle
                </button>
            </div>
            <AIBattleChat
                client={client}
                publicKey={publicKey}
                battleData={battleSetup}
                onTransaction={onTransaction}
            />
        </div>
    );
};

export default AIBattle;

