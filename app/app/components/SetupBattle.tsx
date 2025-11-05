"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SetupBattleProps {
    onSetupComplete: (data: {
        player1: string;
        player2: string;
        nft1ImageUri: string;
        nft2ImageUri: string;
    }) => void;
}

const SetupBattle = ({ onSetupComplete }: SetupBattleProps) => {
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [nft1ImageUri, setNft1ImageUri] = useState("");
    const [nft2ImageUri, setNft2ImageUri] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!player1 || !player2 || !nft1ImageUri || !nft2ImageUri) {
            alert("All fields are required!");
            return;
        }

        // Validate Stellar addresses (basic check)
        if (!player1.startsWith("G") || !player2.startsWith("G")) {
            alert("Please enter valid Stellar addresses (starting with G)");
            return;
        }

        // Store in localStorage
        const battleData = {
            player1,
            player2,
            nft1ImageUri,
            nft2ImageUri,
        };
        localStorage.setItem('battleSetup', JSON.stringify(battleData));

        onSetupComplete(battleData);
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Setup Battle</CardTitle>
                <CardDescription className="text-gray-400">
                    Enter both player addresses and NFT image URIs to start the AI battle
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="player1" className="text-white">Player 1 Address</Label>
                        <Input
                            id="player1"
                            type="text"
                            value={player1}
                            onChange={(e) => setPlayer1(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="G..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="player2" className="text-white">Player 2 Address</Label>
                        <Input
                            id="player2"
                            type="text"
                            value={player2}
                            onChange={(e) => setPlayer2(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="G..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nft1ImageUri" className="text-white">NFT 1 Image URI</Label>
                        <Input
                            id="nft1ImageUri"
                            type="url"
                            value={nft1ImageUri}
                            onChange={(e) => setNft1ImageUri(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="https://example.com/nft1.jpg"
                            required
                        />
                        {nft1ImageUri && nft1ImageUri.startsWith("http") && (
                            <img
                                src={nft1ImageUri}
                                alt="NFT 1 Preview"
                                className="w-full max-w-xs h-auto rounded-lg mt-2"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="nft2ImageUri" className="text-white">NFT 2 Image URI</Label>
                        <Input
                            id="nft2ImageUri"
                            type="url"
                            value={nft2ImageUri}
                            onChange={(e) => setNft2ImageUri(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="https://example.com/nft2.jpg"
                            required
                        />
                        {nft2ImageUri && nft2ImageUri.startsWith("http") && (
                            <img
                                src={nft2ImageUri}
                                alt="NFT 2 Preview"
                                className="w-full max-w-xs h-auto rounded-lg mt-2"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Start AI Battle
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default SetupBattle;

