import Image from "next/image";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen w-full  justify-between font-inter">
            {children}
            <div className="auth-asset">
                <div className="">
                    <Image
                        src="/icons/auth-image.png"
                        className="h-[450px] border-black-2 border-t-4 border-l-4 border-b-4 border-black rounded-t-lg rounded-b-lg"
                        alt="Auth Image"
                        width={500}
                        height={800}
                    />

                </div>
            </div>
        </main>

    );
}
