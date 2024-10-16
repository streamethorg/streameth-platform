import { IClip } from '@interfaces/clip.interface';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClipDto implements IClip {
  @IsNotEmpty()
  @IsString()
  playbackId!: string;

  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsNotEmpty()
  @IsString()
  recordingId!: string;

  @IsNotEmpty()
  @IsNumber()
  start!: number;

  @IsNotEmpty()
  @IsNumber()
  end!: number;

  @IsOptional()
  @IsString()
  organizationId!: string;

  @IsOptional()
  @IsString()
  isEditorEnabled?: boolean;

  @IsOptional()
  @IsObject()
  editorOptions?: {
    frameRate: number;
    events: Array<{ label: string; sessionId: string }>;
    selectedAspectRatio: string;
    captionEnabled: boolean;
    captionPosition: string;
    captionLinesPerPage: number;
    captionFont: string;
    captionColor: string;
  };
}
