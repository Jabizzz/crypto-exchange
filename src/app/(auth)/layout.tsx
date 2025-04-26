export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4 sm:px-0">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-indigo-600">CryptoExchange</h1>
          </div>
          {children}
        </div>
      </div>
    );
  }