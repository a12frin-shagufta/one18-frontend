const BranchSelectModal = ({ isOpen, onClose, branches, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl mx-6 p-8 z-10 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-serif text-center text-[#5c3a21] mb-8">
          Select Your Bakery
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <div
              key={branch._id}
              onClick={() => onSelect(branch)}
              className="cursor-pointer rounded-2xl overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={branch.image}
                className="h-40 w-full object-cover"
              />
              <div className="p-5 text-center">
                <p className="font-serif text-lg">
                  {branch.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {branch.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchSelectModal;
