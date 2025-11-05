"use client";

import { useState } from "react";
import { Client } from "@/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GetGameInfoProps {
    client: Client;
}

const GetGameInfo = ({
    client
}: GetGameInfoProps) => {
    const [gameId, setGameId] = useState("");
    const [gameInfo, setGameInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGameInfo = async () => {
        if (!gameId) {
            alert("Please enter a game ID!");
            return;
        }

        const gameIdNum = parseInt(gameId);
        if (isNaN(gameIdNum) || gameIdNum < 1) {
            alert("Please enter a valid game ID (positive number)!");
            return;
        }

        setIsLoading(true);
        try {
            const result = await client.get_game_info({ game_id: gameIdNum as any });
            setGameInfo(result.result);
        } catch (error: any) {
            console.error("Error fetching game info:", error);
            alert(error.message || "Failed to fetch game info. Game might not exist.");
            setGameInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Get Game Info</CardTitle>
                <CardDescription className="text-gray-400">
                    View game information by game ID
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="gameId" className="text-white">Game ID</Label>
                    <div className="flex gap-2">
                        <Input
                            id="gameId"
                            type="number"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                            className="bg-gray-700 text-white border-gray-600"
                            placeholder="1"
                            min="1"
                        />
                        <Button
                            onClick={fetchGameInfo}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isLoading ? "Loading..." : "Fetch"}
                        </Button>
                    </div>
                </div>

                {gameInfo && (
                    <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                        <h3 className="text-lg font-semibold text-white">Game Information:</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-400">Player 1:</span>
                                <p className="text-white break-all">{gameInfo.player1}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Player 2:</span>
                                <p className="text-white break-all">{gameInfo.player2}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">Winner:</span>
                                <p className="text-green-400 break-all">{gameInfo.winner}</p>
                            </div>
                            <div>
                                <span className="text-gray-400">NFT 1 Image URI:</span>
                                <p className="text-white break-all">{gameInfo.nft1_image_uri}</p>
                                {gameInfo.nft1_image_uri?.startsWith("http") && (
                                    <img
                                        src={gameInfo.nft1_image_uri}
                                        alt="NFT 1"
                                        className="w-full max-w-xs h-auto rounded-lg mt-2"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                )}
                            </div>
                            <div>
                                <span className="text-gray-400">NFT 2 Image URI:</span>
                                <p className="text-white break-all">{gameInfo.nft2_image_uri}</p>
                                {gameInfo.nft2_image_uri?.startsWith("http") && (
                                    <img
                                        src={gameInfo.nft2_image_uri}
                                        alt="NFT 2"
                                        className="w-full max-w-xs h-auto rounded-lg mt-2"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default GetGameInfo;

