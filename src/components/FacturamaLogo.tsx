const FacturamaLogo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-facturama-blue to-info rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">F</span>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-facturama-blue to-info bg-clip-text text-transparent">
        Facturama
      </span>
    </div>
  );
};

export default FacturamaLogo;