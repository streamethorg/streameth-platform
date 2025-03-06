import { useClipPageContext } from '../../ClipPageContext';
import CaptionOptions from './CaptionOptions';
import AspectRatioOptions from './AspectRatioOptions';
import AnimationOptions from './AnimationOptions';

const Editor = () => {

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4">
        <CaptionOptions />
        <AspectRatioOptions />
        <AnimationOptions />
      </div>
    </div>
  );
};

export default Editor;
