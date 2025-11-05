"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GameInfoProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const GameInfo = ({
    client,
    publicKey,
    onTransaction
}: GameInfoProps) => {
    const [player1, setPlayer1] = useState(publicKey);
    const [player2, setPlayer2] = useState("");
    const [nft1ImageUri, setNft1ImageUri] = useState("");
    const [nft2ImageUri, setNft2ImageUri] = useState("");
    const [winner, setWinner] = useState(publicKey);

    const handleGameInfo = async () => {
        if (!player1 || !player2 || !nft1ImageUri || !nft2ImageUri || !winner) {
            alert("All fields are required!");
            return;
        }

        if (winner !== player1 && winner !== player2) {
            alert("Winner must be either player1 or player2!");
            return;
        }

        const promise = client.game_info({
            player1,
            player2,
            nft1_image_uri: nft1ImageUri,
            nft2_image_uri: nft2ImageUri,
            winner,
        }).then(tx => tx.signAndSend());

        onTransaction(promise, "Game info stored successfully!");

        // Reset form (keep player1 and winner as default)
        setPlayer2("");
        setNft1ImageUri("");
        setNft2ImageUri("");
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Store Game Info</CardTitle>
                <CardDescription className="text-gray-400">
                    Store game information after NFTs have been claimed. Returns a game ID.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="player1" className="text-white">Player 1 Address</Label>
                    <Input
                        id="player1"
                        type="text"
                        value={player1}
                        onChange={(e) => setPlayer1(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
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
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nft1ImageUri" className="text-white">NFT 1 Image URI</Label>
                    <Input
                        id="nft1ImageUri"
                        type="text"
                        value={nft1ImageUri}
                        onChange={(e) => setNft1ImageUri(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="https://example.com/nft1.jpg"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nft2ImageUri" className="text-white">NFT 2 Image URI</Label>
                    <Input
                        id="nft2ImageUri"
                        type="text"
                        value={nft2ImageUri}
                        onChange={(e) => setNft2ImageUri(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="https://example.com/nft2.jpg"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="winner" className="text-white">Winner Address</Label>
                    <Input
                        id="winner"
                        type="text"
                        value={winner}
                        onChange={(e) => setWinner(e.target.value)}
                        className="bg-gray-700 text-white border-gray-600"
                        placeholder="G..."
                    />
                    <p className="text-xs text-gray-400">Must be either player1 or player2</p>
                </div>
                <Button
                    onClick={handleGameInfo}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    Store Game Info
                </Button>
            </CardContent>
        </Card>
    );
};

export default GameInfo;

