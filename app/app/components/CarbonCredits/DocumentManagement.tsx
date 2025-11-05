"use client";

import { Client } from "@/index";
import StoreDocument from "./StoreDocument";
import GetDocument from "./GetDocument";
import GetUserDocuments from "./GetUserDocuments";
import GetDocumentsByTags from "./GetDocumentsByTags";
import GetDocumentCount from "./GetDocumentCount";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentManagementProps {
    client: Client;
    publicKey: string;
    onTransaction: (promise: Promise<any>, successMessage: string) => void;
}

const DocumentManagement = ({
    client,
    publicKey,
    onTransaction
}: DocumentManagementProps) => {
    return (
        <Tabs defaultValue="store" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="store">Store</TabsTrigger>
                <TabsTrigger value="view">View</TabsTrigger>
            </TabsList>
            <TabsContent value="store" className="mt-6">
                <StoreDocument
                    client={client}
                    publicKey={publicKey}
                    onTransaction={onTransaction}
                />
            </TabsContent>
            <TabsContent value="view" className="mt-6 space-y-4">
                <GetUserDocuments
                    client={client}
                    publicKey={publicKey}
                />
                <GetDocument
                    client={client}
                    publicKey={publicKey}
                />
                <GetDocumentsByTags
                    client={client}
                    publicKey={publicKey}
                />
                <GetDocumentCount
                    client={client}
                    publicKey={publicKey}
                />
            </TabsContent>
        </Tabs>
    );
};

export default DocumentManagement;

