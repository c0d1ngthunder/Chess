const Connected = () => {
  return (
    <div className="fixed bottom-6 right-28 md:w-auto md:bottom-auto md:top-[90%] md:-translate-y-1/2 bg-[#0d1117] border border-[#30363d] shadow-[0_0_15px_rgba(20,184,166,0.15)] p-4 z-50 font-mono">
      <span className="text-[#14b8a6] mr-2">&gt;</span>
      <span>CONNECTION_STATUS:</span>
      <span className="text-green-400 ml-2">ESTABLISHED</span>
      <div className="text-xs text-gray-400 mt-1">
        Game session initialized. Starting match...
      </div>
      <div className="w-full h-1 bg-[#30363d] mt-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#14b8a6] animate-[decrease_3s_linear_forwards]"></div>
      </div>
    </div>
  );
};

export default Connected;
