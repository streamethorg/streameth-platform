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
  clipUrl!: string;

  @IsNotEmpty()
  @IsString()
  sessionId!: string;

  @IsNotEmpty()
  @IsNumber()
  start!: number;

  @IsNotEmpty()
  @IsNumber()
  end!: number;

  @IsNotEmpty()
  @IsString()
  organizationId!: string;

  @IsOptional()
  @IsString()
  isEditorEnabled?: boolean;

  @IsOptional()
  @IsObject()
  editorOptions?: {
    frameRate: number;
    events: Array<{
      label: string;
      sessionId?: string;
      videoUrl?: string;
    }>;
    selectedAspectRatio: string;
    captionEnabled: boolean;
    captionPosition: string;
    captionLinesPerPage: number;
    captionFont: string;
    captionColor: string;
  };
}
