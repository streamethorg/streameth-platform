import { z } from 'zod';
import { useRendering } from '../../../../../../../reel-creator/helpers/use-rendering';
import {
  EditorProps,
  COMP_NAME,
} from '../../../../../../../reel-creator/types/constants';
import { AlignEnd } from '../../../../../../../reel-creator/components/AlignEnd';
import { Button } from '../../../../../../../reel-creator/components/Button';
import { InputContainer } from '../../../../../../../reel-creator/components/Container';
import { DownloadButton } from '../../../../../../../reel-creator/components/DownloadButton';
import { ErrorComp } from '../../../../../../../reel-creator/components/Error';
import { Progress } from '@/components/ui/progress';
import { Spacing } from '@/components/ui/Spacing';

export const RenderControls: React.FC<{
  inputProps: EditorProps;
}> = ({ inputProps }) => {
  const { renderMedia, state, undo } = useRendering(COMP_NAME, {
    ...inputProps,
  });

  return (
    <InputContainer>
      {state.status === 'init' ||
      state.status === 'invoking' ||
      state.status === 'error' ? (
        <>
          <Spacing></Spacing>
          <AlignEnd>
            <Button
              disabled={state.status === 'invoking'}
              loading={state.status === 'invoking'}
              onClick={renderMedia}
            >
              Render video
            </Button>
          </AlignEnd>
          {state.status === 'error' ? (
            <ErrorComp message={state.error.message}></ErrorComp>
          ) : null}
        </>
      ) : null}
      {state.status === 'rendering' || state.status === 'done' ? (
        <>
          <Progress value={state.status === 'rendering' ? state.progress : 1} />
          <Spacing></Spacing>
          <AlignEnd>
            <DownloadButton undo={undo} state={state}></DownloadButton>
          </AlignEnd>
        </>
      ) : null}
    </InputContainer>
  );
};
