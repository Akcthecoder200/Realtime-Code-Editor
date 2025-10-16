import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useEffect, useState } from "react";
import "tldraw/tldraw.css";

const Whiteboard = ({ roomId }) => {
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Create a local store without external sync
    const localStore = createTLStore({
      shapeUtils: defaultShapeUtils,
    });

    setStore(localStore);

    // Cleanup function
    return () => {
      if (localStore) {
        localStore.dispose();
      }
    };
  }, [roomId]);

  if (!store) {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-200 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md z-10">
          <FaChalkboardTeacher className="text-2xl animate-pulse" />
          <h2 className="text-xl font-bold tracking-wide drop-shadow-lg">
            Collaborative Whiteboard
          </h2>
          <span className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-mono tracking-wider border border-white/30">
            Room: {roomId}
          </span>
        </div>
        <div className="flex-1 p-2 md:p-4 lg:p-6 bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading whiteboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md z-10">
        <FaChalkboardTeacher className="text-2xl animate-pulse" />
        <h2 className="text-xl font-bold tracking-wide drop-shadow-lg">
          Collaborative Whiteboard
        </h2>
        <span className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-mono tracking-wider border border-white/30">
          Room: {roomId}
        </span>
      </div>
      <div className="flex-1 p-2 md:p-4 lg:p-6 bg-white/80">
        <div className="w-full h-full rounded-xl border-2 border-dashed border-purple-300 shadow-inner overflow-hidden">
          <Tldraw store={store} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
