import { Tldraw } from "@tldraw/tldraw";
import { useSyncDemo } from "@tldraw/sync";

import "tldraw/tldraw.css";

const Whiteboard = ({ roomId }) => {
  const store = useSyncDemo({ roomId });

  return (
    <div className="w-full h-full">
      <Tldraw store={store} deepLinks />
    </div>
  );
};

export default Whiteboard;
