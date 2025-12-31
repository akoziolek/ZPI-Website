import Navbar from "../components/Navbar";

const ZPIPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Moje ZPI
              </h3>

              <div className="text-center py-12">
                <div className="text-gray-500">
                  <p className="text-lg mb-4">Strona w trakcie tworzenia</p>
                  <p>Tutaj będą wyświetlane informacje o Twoich projektach ZPI, statusach i postępach.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Aktualne projekty</h4>
                  <p className="text-sm text-gray-600">Lista Twoich aktywnych projektów ZPI</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Terminy</h4>
                  <p className="text-sm text-gray-600">Ważne daty i deadlines</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Oceny</h4>
                  <p className="text-sm text-gray-600">Wyniki i oceny projektów</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZPIPage;