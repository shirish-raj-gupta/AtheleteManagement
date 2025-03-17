export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <h1 className="text-4xl font-bold">Athlete Management Solution</h1>
      <a href="/auth/login" className="px-6 py-2 bg-black text-white rounded-md">Login</a>
      <a href="/auth/register" className="px-6 py-2 bg-black text-white rounded-md">Register</a>
    </div>
  );
}
