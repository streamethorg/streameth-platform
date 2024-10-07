/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TsoaRoute, fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SupportController } from './../controllers/support.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StreamController } from './../controllers/stream.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StateController } from './../controllers/state.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { StageController } from './../controllers/stage.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SpeakerController } from './../controllers/speaker.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SessionController } from './../controllers/session.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScheduleImporterController } from './../controllers/schedule-import.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { OrganizationController } from './../controllers/organization.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NftCollectionRouter } from './../controllers/nft.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarkerController } from './../controllers/marker.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { IndexController } from './../controllers/index.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EventController } from './../controllers/event.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ChatController } from './../controllers/chat.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/auth.controller';
import { expressAuthentication } from './../middlewares/auth.middleware';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
const multer = require('multer');


const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISocials": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "type": {"dataType":"string","required":true},
            "accessToken": {"dataType":"string","required":true},
            "refreshToken": {"dataType":"string","required":true},
            "expireTime": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string"},
            "channelId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IOrganization": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "bio": {"dataType":"string"},
            "url": {"dataType":"string"},
            "logo": {"dataType":"string","required":true},
            "location": {"dataType":"string"},
            "accentColor": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "banner": {"dataType":"string"},
            "address": {"dataType":"string"},
            "socials": {"dataType":"array","array":{"dataType":"refObject","ref":"ISocials"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserRole": {
        "dataType": "refEnum",
        "enums": ["user","admin"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "organizations": {"dataType":"array","array":{"dataType":"refObject","ref":"IOrganization"}},
            "role": {"ref":"UserRole"},
            "token": {"dataType":"string"},
            "did": {"dataType":"string"},
            "email": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IUser_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IUser"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISupport": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "telegram": {"dataType":"string"},
            "email": {"dataType":"string"},
            "image": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_ISupport_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"ISupport"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSupportTicketDto": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "telegram": {"dataType":"string"},
            "email": {"dataType":"string"},
            "image": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_ISupport-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ISupport"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_any_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMultiStreamDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "streamId": {"dataType":"string","required":true},
            "targetStreamKey": {"dataType":"string","required":true},
            "targetURL": {"dataType":"string","required":true},
            "organizationId": {"dataType":"string","required":true},
            "socialId": {"dataType":"string"},
            "socialType": {"dataType":"string"},
            "broadcastId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_void_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"void"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeleteMultiStreamDto": {
        "dataType": "refObject",
        "properties": {
            "streamId": {"dataType":"string","required":true},
            "targetId": {"dataType":"string","required":true},
            "organizationId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__url-string--assetId-string__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"assetId":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_string_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__playbackUrl-string--phaseStatus-string__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"phaseStatus":{"dataType":"string","required":true},"playbackUrl":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__viewCount-number--playTimeMins-number__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"playTimeMins":{"dataType":"double","required":true},"viewCount":{"dataType":"double","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateClipDto": {
        "dataType": "refObject",
        "properties": {
            "playbackId": {"dataType":"string","required":true},
            "sessionId": {"dataType":"string","required":true},
            "recordingId": {"dataType":"string","required":true},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__type-string--url-string__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true},"type":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SheetType": {
        "dataType": "refEnum",
        "enums": ["gsheet","pretalx"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SocialType": {
        "dataType": "refEnum",
        "enums": ["twitter","youtube"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StateStatus": {
        "dataType": "refEnum",
        "enums": ["pending","completed","canceled","sync","failed"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StateType": {
        "dataType": "refEnum",
        "enums": ["nft","event","video","transcrpition","social"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IState": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "eventId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "organizationId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "sessionId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "eventSlug": {"dataType":"string"},
            "sessionSlug": {"dataType":"string"},
            "sheetType": {"ref":"SheetType"},
            "socialType": {"ref":"SocialType"},
            "status": {"ref":"StateStatus"},
            "type": {"ref":"StateType"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IState_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IState"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateStateDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "eventId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "organizationId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "sessionId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "eventSlug": {"dataType":"string"},
            "sessionSlug": {"dataType":"string"},
            "sheetType": {"ref":"SheetType"},
            "socialType": {"ref":"SocialType"},
            "status": {"ref":"StateStatus"},
            "type": {"ref":"StateType"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateStateDto": {
        "dataType": "refObject",
        "properties": {
            "eventId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "organizationId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "sessionId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "eventSlug": {"dataType":"string"},
            "sessionSlug": {"dataType":"string"},
            "sheetType": {"ref":"SheetType"},
            "status": {"ref":"StateStatus"},
            "type": {"ref":"StateType"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_IState__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IState"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TargetOutput": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "id": {"dataType":"string"},
            "name": {"dataType":"string"},
            "socialId": {"dataType":"string"},
            "socialType": {"dataType":"string"},
            "broadcastId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStreamSettings": {
        "dataType": "refObject",
        "properties": {
            "streamId": {"dataType":"string"},
            "parentId": {"dataType":"string"},
            "playbackId": {"dataType":"string"},
            "isHealthy": {"dataType":"boolean"},
            "isActive": {"dataType":"boolean"},
            "streamKey": {"dataType":"string"},
            "ipfshash": {"dataType":"string"},
            "targets": {"dataType":"array","array":{"dataType":"refObject","ref":"TargetOutput"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlugin": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StageType": {
        "dataType": "refEnum",
        "enums": ["custom","livepeer"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStage": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "eventId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "streamSettings": {"ref":"IStreamSettings"},
            "plugins": {"dataType":"array","array":{"dataType":"refObject","ref":"IPlugin"}},
            "order": {"dataType":"double"},
            "slug": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "isMultipleDate": {"dataType":"boolean"},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "thumbnail": {"dataType":"string"},
            "streamDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "streamEndDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "mintable": {"dataType":"boolean"},
            "createdAt": {"dataType":"string"},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
            "recordingIndex": {"dataType":"double"},
            "type": {"ref":"StageType"},
            "source": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string","required":true},"m3u8Url":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IStage_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IStage"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateStageDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "eventId": {"dataType":"string"},
            "streamSettings": {"ref":"IStreamSettings"},
            "plugins": {"dataType":"array","array":{"dataType":"refObject","ref":"IPlugin"}},
            "order": {"dataType":"double"},
            "slug": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "isMultipleDate": {"dataType":"boolean"},
            "organizationId": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string"},
            "streamDate": {"dataType":"datetime"},
            "streamEndDate": {"dataType":"datetime"},
            "mintable": {"dataType":"boolean"},
            "createdAt": {"dataType":"string"},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
            "recordingIndex": {"dataType":"double"},
            "type": {"ref":"StageType"},
            "source": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string","required":true},"m3u8Url":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateHlsStageDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "eventId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "streamSettings": {"ref":"IStreamSettings"},
            "plugins": {"dataType":"array","array":{"dataType":"refObject","ref":"IPlugin"}},
            "order": {"dataType":"double"},
            "slug": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "isMultipleDate": {"dataType":"boolean"},
            "organizationId": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string"},
            "streamDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "streamEndDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "mintable": {"dataType":"boolean"},
            "createdAt": {"dataType":"string"},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
            "recordingIndex": {"dataType":"double"},
            "type": {"ref":"StageType"},
            "source": {"dataType":"nestedObjectLiteral","nestedProperties":{"type":{"dataType":"string","required":true},"m3u8Url":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
            "url": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateStageDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "eventId": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "isMultipleDate": {"dataType":"boolean"},
            "streamSettings": {"ref":"IStreamSettings"},
            "plugins": {"dataType":"array","array":{"dataType":"refObject","ref":"IPlugin"}},
            "order": {"dataType":"double"},
            "organizationId": {"dataType":"string","required":true},
            "slug": {"dataType":"string"},
            "streamDate": {"dataType":"string"},
            "streamEndDate": {"dataType":"string"},
            "thumbnail": {"dataType":"string"},
            "mintable": {"dataType":"boolean"},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_IStage__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IStage"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "OrgIdDto": {
        "dataType": "refObject",
        "properties": {
            "organizationId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__streamKey-string--ingestUrl-string__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"ingestUrl":{"dataType":"string","required":true},"streamKey":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateLiveStreamDto": {
        "dataType": "refObject",
        "properties": {
            "stageId": {"dataType":"string","required":true},
            "socialId": {"dataType":"string","required":true},
            "socialType": {"dataType":"string","required":true},
            "organizationId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISpeaker": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "bio": {"dataType":"string","required":true},
            "eventId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "twitter": {"dataType":"string"},
            "github": {"dataType":"string"},
            "website": {"dataType":"string"},
            "photo": {"dataType":"string"},
            "company": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_ISpeaker_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"ISpeaker"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSpeakerDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "name": {"dataType":"string","required":true},
            "bio": {"dataType":"string","required":true},
            "eventId": {"dataType":"string","required":true},
            "twitter": {"dataType":"string"},
            "github": {"dataType":"string"},
            "website": {"dataType":"string"},
            "photo": {"dataType":"string"},
            "company": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "organizationId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_ISpeaker__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ISpeaker"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ISpeaker.Exclude_keyofISpeaker.organizationId__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"_id":{"dataType":"string"},"name":{"dataType":"string","required":true},"bio":{"dataType":"string","required":true},"eventId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},"twitter":{"dataType":"string"},"github":{"dataType":"string"},"website":{"dataType":"string"},"photo":{"dataType":"string"},"company":{"dataType":"string"},"slug":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_ISpeaker.organizationId_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_ISpeaker.Exclude_keyofISpeaker.organizationId__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISource": {
        "dataType": "refObject",
        "properties": {
            "streamUrl": {"dataType":"string"},
            "start": {"dataType":"double"},
            "end": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlayback": {
        "dataType": "refObject",
        "properties": {
            "livepeerId": {"dataType":"string"},
            "videoUrl": {"dataType":"string"},
            "ipfsHash": {"dataType":"string"},
            "format": {"dataType":"string"},
            "duration": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SessionType": {
        "dataType": "refEnum",
        "enums": ["clip","livestream","video"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ClippingStatus": {
        "dataType": "refEnum",
        "enums": ["pending","failed","completed"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ISession": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
            "startClipTime": {"dataType":"double"},
            "endClipTime": {"dataType":"double"},
            "stageId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "speakers": {"dataType":"array","array":{"dataType":"refAlias","ref":"Omit_ISpeaker.organizationId_"}},
            "source": {"ref":"ISource"},
            "assetId": {"dataType":"string"},
            "playback": {"ref":"IPlayback"},
            "videoUrl": {"dataType":"string"},
            "playbackId": {"dataType":"string"},
            "eventId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "track": {"dataType":"array","array":{"dataType":"string"}},
            "coverImage": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "eventSlug": {"dataType":"string"},
            "videoTranscription": {"dataType":"string"},
            "aiDescription": {"dataType":"string"},
            "autoLabels": {"dataType":"array","array":{"dataType":"string"}},
            "ipfsURI": {"dataType":"string"},
            "mintable": {"dataType":"boolean"},
            "published": {"dataType":"boolean"},
            "type": {"ref":"SessionType","required":true},
            "createdAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
            "socials": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"date":{"dataType":"double","required":true},"name":{"dataType":"string","required":true}}}},
            "firebaseId": {"dataType":"string"},
            "talkType": {"dataType":"string"},
            "clippingStatus": {"ref":"ClippingStatus"},
            "transcripts": {"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"chunks":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"timestamp":{"dataType":"array","array":{"dataType":"double"},"required":true}}},"required":true},"subtitleUrl":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_ISession_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"ISession"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_ISession.Exclude_keyofISession._id__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"organizationId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},"name":{"dataType":"string","required":true},"eventId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},"slug":{"dataType":"string"},"description":{"dataType":"string"},"start":{"dataType":"double","required":true},"end":{"dataType":"double","required":true},"startClipTime":{"dataType":"double"},"endClipTime":{"dataType":"double"},"stageId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},"speakers":{"dataType":"array","array":{"dataType":"refAlias","ref":"Omit_ISpeaker.organizationId_"}},"source":{"ref":"ISource"},"assetId":{"dataType":"string"},"playback":{"ref":"IPlayback"},"videoUrl":{"dataType":"string"},"playbackId":{"dataType":"string"},"track":{"dataType":"array","array":{"dataType":"string"}},"coverImage":{"dataType":"string"},"eventSlug":{"dataType":"string"},"videoTranscription":{"dataType":"string"},"aiDescription":{"dataType":"string"},"autoLabels":{"dataType":"array","array":{"dataType":"string"}},"ipfsURI":{"dataType":"string"},"mintable":{"dataType":"boolean"},"published":{"dataType":"boolean"},"type":{"ref":"SessionType","required":true},"createdAt":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},"nftCollections":{"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},"socials":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"date":{"dataType":"double","required":true},"name":{"dataType":"string","required":true}}}},"firebaseId":{"dataType":"string"},"talkType":{"dataType":"string"},"clippingStatus":{"ref":"ClippingStatus"},"transcripts":{"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"chunks":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"timestamp":{"dataType":"array","array":{"dataType":"double"},"required":true}}},"required":true},"subtitleUrl":{"dataType":"string","required":true}}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateSessionDto": {
        "dataType": "refObject",
        "properties": {
            "organizationId": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "eventId": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "description": {"dataType":"string","required":true},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
            "startClipTime": {"dataType":"double"},
            "endClipTime": {"dataType":"double"},
            "stageId": {"dataType":"string"},
            "speakers": {"dataType":"array","array":{"dataType":"refObject","ref":"ISpeaker"},"required":true},
            "source": {"ref":"ISource"},
            "assetId": {"dataType":"string"},
            "playback": {"ref":"IPlayback"},
            "videoUrl": {"dataType":"string"},
            "playbackId": {"dataType":"string"},
            "track": {"dataType":"array","array":{"dataType":"string"}},
            "coverImage": {"dataType":"string"},
            "eventSlug": {"dataType":"string"},
            "videoTranscription": {"dataType":"string"},
            "aiDescription": {"dataType":"string"},
            "autoLabels": {"dataType":"array","array":{"dataType":"string"}},
            "ipfsURI": {"dataType":"string"},
            "mintable": {"dataType":"boolean"},
            "published": {"dataType":"boolean"},
            "type": {"ref":"SessionType","required":true},
            "createdAt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"datetime"}]},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
            "socials": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"date":{"dataType":"double","required":true},"name":{"dataType":"string","required":true}}}},
            "firebaseId": {"dataType":"string"},
            "talkType": {"dataType":"string"},
            "clippingStatus": {"ref":"ClippingStatus"},
            "transcripts": {"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"chunks":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"text":{"dataType":"string","required":true},"timestamp":{"dataType":"array","array":{"dataType":"double"},"required":true}}},"required":true},"subtitleUrl":{"dataType":"string","required":true}}},
            "autolabels": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateSessionDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
            "startClipTime": {"dataType":"double"},
            "endClipTime": {"dataType":"double"},
            "stageId": {"dataType":"string"},
            "speakers": {"dataType":"array","array":{"dataType":"refAlias","ref":"Omit_ISpeaker.organizationId_"},"required":true},
            "source": {"ref":"ISource"},
            "playback": {"ref":"IPlayback"},
            "videoUrl": {"dataType":"string"},
            "playbackId": {"dataType":"string"},
            "eventId": {"dataType":"string"},
            "organizationId": {"dataType":"string","required":true},
            "track": {"dataType":"array","array":{"dataType":"string"}},
            "coverImage": {"dataType":"string"},
            "eventSlug": {"dataType":"string"},
            "videoTranscription": {"dataType":"string"},
            "aiDescription": {"dataType":"string"},
            "autolabels": {"dataType":"array","array":{"dataType":"string"}},
            "assetId": {"dataType":"string"},
            "ipfsURI": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "type": {"ref":"SessionType","required":true},
            "nftURI": {"dataType":"string"},
            "mintable": {"dataType":"boolean"},
            "nftCollections": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"array","array":{"dataType":"string"}}]},
            "active": {"dataType":"boolean"},
            "socials": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"date":{"dataType":"double","required":true},"name":{"dataType":"string","required":true}}}},
            "createdAt": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_ISession__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ISession"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_UploadSessionDto.organizationId-or-sessionId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"organizationId":{"dataType":"string"},"sessionId":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UploadSessionDto": {
        "dataType": "refObject",
        "properties": {
            "socialId": {"dataType":"string"},
            "organizationId": {"dataType":"string"},
            "sessionId": {"dataType":"string","required":true},
            "token": {"dataType":"nestedObjectLiteral","nestedProperties":{"secret":{"dataType":"string","required":true},"key":{"dataType":"string"}}},
            "type": {"dataType":"string","required":true},
            "text": {"dataType":"string"},
            "refreshToken": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__sessions-Array_ISession_--totalDocuments-number--pageable_58__page-number--size-number___": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"pageable":{"dataType":"nestedObjectLiteral","nestedProperties":{"size":{"dataType":"double","required":true},"page":{"dataType":"double","required":true}},"required":true},"totalDocuments":{"dataType":"double","required":true},"sessions":{"dataType":"array","array":{"dataType":"refObject","ref":"ISession"},"required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ImportType": {
        "dataType": "refEnum",
        "enums": ["gsheet","pretalx"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IScheduleImporterDto.url-or-type-or-organizationId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"organizationId":{"dataType":"string","required":true},"type":{"ref":"ImportType","required":true},"url":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ImportStatus": {
        "dataType": "refEnum",
        "enums": ["pending","completed","failed"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IScheduleImportMetadata": {
        "dataType": "refObject",
        "properties": {
            "sessions": {"dataType":"array","array":{"dataType":"refObject","ref":"ISession"},"required":true},
            "stages": {"dataType":"array","array":{"dataType":"refObject","ref":"IStage"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IScheduleImporter": {
        "dataType": "refObject",
        "properties": {
            "url": {"dataType":"string","required":true},
            "type": {"ref":"ImportType","required":true},
            "status": {"ref":"ImportStatus","required":true},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "stageId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "metadata": {"ref":"IScheduleImportMetadata","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IScheduleImporter_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IScheduleImporter"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IScheduleImporterDto.url-or-type-or-organizationId-or-stageId_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"organizationId":{"dataType":"string","required":true},"stageId":{"dataType":"string","required":true},"type":{"ref":"ImportType","required":true},"url":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IOrganization_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IOrganization"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_IOrganization.Exclude_keyofIOrganization._id__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"bio":{"dataType":"string"},"slug":{"dataType":"string"},"description":{"dataType":"string"},"socials":{"dataType":"array","array":{"dataType":"refObject","ref":"ISocials"}},"url":{"dataType":"string"},"email":{"dataType":"string","required":true},"logo":{"dataType":"string","required":true},"location":{"dataType":"string"},"accentColor":{"dataType":"string"},"banner":{"dataType":"string"},"address":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrganizationDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "bio": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "description": {"dataType":"string"},
            "socials": {"dataType":"array","array":{"dataType":"refObject","ref":"ISocials"}},
            "url": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "logo": {"dataType":"string","required":true},
            "location": {"dataType":"string"},
            "accentColor": {"dataType":"string"},
            "banner": {"dataType":"string"},
            "address": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateOrganizationDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "logo": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "banner": {"dataType":"string"},
            "organizationId": {"dataType":"string"},
            "url": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CreateOrganizationDto.address_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"address":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_IOrganization__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IOrganization"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_IUser__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IUser"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NftCollectionType": {
        "dataType": "refEnum",
        "enums": ["single","multiple"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "INftCollection": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "thumbnail": {"dataType":"string"},
            "type": {"ref":"NftCollectionType"},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "videos": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"ipfsURI":{"dataType":"string"},"stageId":{"dataType":"string"},"sessionId":{"dataType":"string"},"type":{"dataType":"string","required":true},"index":{"dataType":"double"}}}},
            "contractAddress": {"dataType":"string"},
            "ipfsPath": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_INftCollection_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"INftCollection"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateNftCollectionDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string","required":true},
            "type": {"ref":"NftCollectionType","required":true},
            "organizationId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "videos": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"ipfsURI":{"dataType":"string","required":true},"stageId":{"dataType":"string"},"sessionId":{"dataType":"string"},"type":{"dataType":"string","required":true},"index":{"dataType":"double","required":true}}},"required":true},
            "contractAddress": {"dataType":"string"},
            "ipfsPath": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__ipfsPath-string--videos-Array_any___": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"videos":{"dataType":"array","array":{"dataType":"any"},"required":true},"ipfsPath":{"dataType":"string","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateNftCollectionDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "thumbnail": {"dataType":"string"},
            "contractAddress": {"dataType":"string"},
            "ipfsPath": {"dataType":"string"},
            "type": {"ref":"NftCollectionType"},
            "organizationId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},
            "videos": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"ipfsURI":{"dataType":"string"},"stageId":{"dataType":"string"},"sessionId":{"dataType":"string"},"type":{"dataType":"string","required":true},"index":{"dataType":"double"}}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_INftCollection__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"INftCollection"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMarker": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "stageId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
            "date": {"dataType":"string","required":true},
            "color": {"dataType":"string","required":true},
            "speakers": {"dataType":"array","array":{"dataType":"refObject","ref":"ISpeaker"}},
            "slug": {"dataType":"string"},
            "startClipTime": {"dataType":"double","required":true},
            "endClipTime": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IMarker_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IMarker"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateMarkerDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string"},
            "organizationId": {"dataType":"string","required":true},
            "stageId": {"dataType":"string","required":true},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
            "date": {"dataType":"string","required":true},
            "color": {"dataType":"string","required":true},
            "speakers": {"dataType":"array","array":{"dataType":"refObject","ref":"ISpeaker"}},
            "slug": {"dataType":"string"},
            "startClipTime": {"dataType":"double","required":true},
            "endClipTime": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IMarker-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IMarker"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateMarkerDto": {
        "dataType": "refObject",
        "properties": {
            "organizationId": {"dataType":"string","required":true},
            "markers": {"dataType":"array","array":{"dataType":"refObject","ref":"IMarker"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_IMarker__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IMarker"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GSheetConfig": {
        "dataType": "refObject",
        "properties": {
            "sheetId": {"dataType":"string"},
            "apiKey": {"dataType":"string"},
            "driveId": {"dataType":"string"},
            "driveApiKey": {"dataType":"string"},
            "url": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PretalxConfig": {
        "dataType": "refObject",
        "properties": {
            "url": {"dataType":"string"},
            "apiToken": {"dataType":"string","required":true},
            "sheetId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDataImporter": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"config":{"ref":"GSheetConfig","required":true},"type":{"dataType":"enum","enums":["gsheet"],"required":true}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"config":{"ref":"PretalxConfig","required":true},"type":{"dataType":"enum","enums":["pretalx"],"required":true}}}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IDataExporter": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"config":{"ref":"GSheetConfig","required":true},"type":{"dataType":"enum","enums":["gdrive"],"required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IPlugins": {
        "dataType": "refObject",
        "properties": {
            "disableChat": {"dataType":"boolean","required":true},
            "hideSchedule": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEventNFT": {
        "dataType": "refObject",
        "properties": {
            "address": {"dataType":"string"},
            "name": {"dataType":"string"},
            "symbol": {"dataType":"string"},
            "uri": {"dataType":"string"},
            "maxSupply": {"dataType":"string"},
            "mintFee": {"dataType":"string"},
            "startTime": {"dataType":"string"},
            "endTime": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IEvent": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "start": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "end": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}],"required":true},
            "location": {"dataType":"string","required":true},
            "logo": {"dataType":"string"},
            "banner": {"dataType":"string"},
            "startTime": {"dataType":"string"},
            "endTime": {"dataType":"string"},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "dataImporter": {"dataType":"array","array":{"dataType":"refAlias","ref":"IDataImporter"}},
            "eventCover": {"dataType":"string"},
            "archiveMode": {"dataType":"boolean"},
            "website": {"dataType":"string"},
            "timezone": {"dataType":"string","required":true},
            "accentColor": {"dataType":"string"},
            "unlisted": {"dataType":"boolean"},
            "dataExporter": {"dataType":"array","array":{"dataType":"refAlias","ref":"IDataExporter"}},
            "enableVideoDownloader": {"dataType":"boolean"},
            "plugins": {"ref":"IPlugins"},
            "slug": {"dataType":"string"},
            "eventNFT": {"ref":"IEventNFT"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IEvent_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IEvent"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateEventDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "start": {"dataType":"datetime","required":true},
            "end": {"dataType":"datetime","required":true},
            "location": {"dataType":"string","required":true},
            "logo": {"dataType":"string","required":true},
            "banner": {"dataType":"string","required":true},
            "startTime": {"dataType":"string"},
            "endTime": {"dataType":"string"},
            "organizationId": {"dataType":"string","required":true},
            "dataImporter": {"dataType":"array","array":{"dataType":"refAlias","ref":"IDataImporter"}},
            "eventCover": {"dataType":"string"},
            "archiveMode": {"dataType":"boolean"},
            "website": {"dataType":"string"},
            "timezone": {"dataType":"string","required":true},
            "accentColor": {"dataType":"string"},
            "unlisted": {"dataType":"boolean"},
            "dataExporter": {"dataType":"array","array":{"dataType":"refAlias","ref":"IDataExporter"}},
            "enableVideoDownloader": {"dataType":"boolean"},
            "plugins": {"ref":"IPlugins"},
            "slug": {"dataType":"string"},
            "eventNFT": {"ref":"IEventNFT"},
            "nftAddress": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateEventDto": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}]},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "start": {"dataType":"string","required":true},
            "end": {"dataType":"string","required":true},
            "location": {"dataType":"string","required":true},
            "logo": {"dataType":"string","required":true},
            "banner": {"dataType":"string","required":true},
            "startTime": {"dataType":"string"},
            "endTime": {"dataType":"string"},
            "organizationId": {"dataType":"string","required":true},
            "dataImporter": {"dataType":"array","array":{"dataType":"refAlias","ref":"IDataImporter"}},
            "eventCover": {"dataType":"string"},
            "archiveMode": {"dataType":"boolean"},
            "website": {"dataType":"string"},
            "timezone": {"dataType":"string","required":true},
            "accentColor": {"dataType":"string"},
            "unlisted": {"dataType":"boolean"},
            "dataExporter": {"dataType":"array","array":{"dataType":"refAlias","ref":"IDataExporter"}},
            "enableVideoDownloader": {"dataType":"boolean"},
            "plugins": {"ref":"IPlugins"},
            "slug": {"dataType":"string"},
            "eventNFT": {"ref":"IEventNFT"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_Array_IEvent__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IEvent"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFrom": {
        "dataType": "refObject",
        "properties": {
            "identity": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IChat": {
        "dataType": "refObject",
        "properties": {
            "stageId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "message": {"dataType":"string","required":true},
            "from": {"ref":"IFrom","required":true},
            "timestamp": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IChat_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"ref":"IChat"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateChatDto": {
        "dataType": "refObject",
        "properties": {
            "stageId": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "from": {"ref":"IFrom","required":true},
            "timestamp": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_IChat-Array_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"IChat"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse__user-IUser--token-string__": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string","required":true},"user":{"ref":"IUser","required":true}}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UserDto": {
        "dataType": "refObject",
        "properties": {
            "token": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        app.get('/users/:walletAddress',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserById)),

            async function UserController_getUserById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    walletAddress: {"in":"path","name":"walletAddress","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/Tickets',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(SupportController)),
            ...(fetchMiddlewares<RequestHandler>(SupportController.prototype.createTicket)),

            async function SupportController_createTicket(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSupportTicketDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SupportController();

              await templateService.apiHandler({
                methodName: 'createTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/Tickets',
            ...(fetchMiddlewares<RequestHandler>(SupportController)),
            ...(fetchMiddlewares<RequestHandler>(SupportController.prototype.getAllTickets)),

            async function SupportController_getAllTickets(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SupportController();

              await templateService.apiHandler({
                methodName: 'getAllTickets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/streams/multistream',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.createMultiStream)),

            async function StreamController_createMultiStream(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMultiStreamDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'createMultiStream',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/streams/multistream',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.deleteMultiStream)),

            async function StreamController_deleteMultiStream(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"DeleteMultiStreamDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'deleteMultiStream',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/streams/asset',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.createAsset)),

            async function StreamController_createAsset(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'createAsset',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/:streamId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getStream)),

            async function StreamController_getStream(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    streamId: {"in":"path","name":"streamId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getStream',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/asset/:assetId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getAsset)),

            async function StreamController_getAsset(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    assetId: {"in":"path","name":"assetId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getAsset',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/asset/url/:assetId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getVideoUrl)),

            async function StreamController_getVideoUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    assetId: {"in":"path","name":"assetId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getVideoUrl',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/asset/phase-action/:assetId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getPhaseAction)),

            async function StreamController_getPhaseAction(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    assetId: {"in":"path","name":"assetId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getPhaseAction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/metric/:playbackId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getSessionMetrics)),

            async function StreamController_getSessionMetrics(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    playbackId: {"in":"path","name":"playbackId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getSessionMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/recording/:streamId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getStreamRecordings)),

            async function StreamController_getStreamRecordings(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    streamId: {"in":"path","name":"streamId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getStreamRecordings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/streams/upload/:assetId',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.uploadToIpfs)),

            async function StreamController_uploadToIpfs(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    assetId: {"in":"path","name":"assetId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'uploadToIpfs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/streams/clip',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.createClip)),

            async function StreamController_createClip(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateClipDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'createClip',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/streams/thumbnail/generate',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.generateThumbnail)),

            async function StreamController_generateThumbnail(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'generateThumbnail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/streams/hls',
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getHls)),

            async function StreamController_getHls(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"url":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              await templateService.apiHandler({
                methodName: 'getHls',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/states',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StateController)),
            ...(fetchMiddlewares<RequestHandler>(StateController.prototype.createState)),

            async function StateController_createState(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateStateDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StateController();

              await templateService.apiHandler({
                methodName: 'createState',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/states/:stateId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StateController)),
            ...(fetchMiddlewares<RequestHandler>(StateController.prototype.updateState)),

            async function StateController_updateState(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stateId: {"in":"path","name":"stateId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateStateDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StateController();

              await templateService.apiHandler({
                methodName: 'updateState',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/states',
            ...(fetchMiddlewares<RequestHandler>(StateController)),
            ...(fetchMiddlewares<RequestHandler>(StateController.prototype.getAllStates)),

            async function StateController_getAllStates(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"query","name":"eventId","dataType":"string"},
                    sessionId: {"in":"query","name":"sessionId","dataType":"string"},
                    eventSlug: {"in":"query","name":"eventSlug","dataType":"string"},
                    type: {"in":"query","name":"type","dataType":"string"},
                    status: {"in":"query","name":"status","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StateController();

              await templateService.apiHandler({
                methodName: 'getAllStates',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/stages',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.createStage)),

            async function StageController_createStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateStageDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'createStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/stages/hls',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.createHlsStage)),

            async function StageController_createHlsStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateHlsStageDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'createHlsStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/stages/:stageId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.editStage)),

            async function StageController_editStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateStageDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'editStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/stages/:stageId',
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.getStageById)),

            async function StageController_getStageById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'getStageById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/stages',
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.getAllStages)),

            async function StageController_getAllStages(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    published: {"in":"query","name":"published","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'getAllStages',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/stages/event/:eventId',
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.getAllStagesForEvent)),

            async function StageController_getAllStagesForEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'getAllStagesForEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/stages/organization/:organizationId',
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.getAllStagesForOrganization)),

            async function StageController_getAllStagesForOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'getAllStagesForOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/stages/:stageId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.deleteStage)),

            async function StageController_deleteStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'deleteStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/stages/livestream',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.youtubeStage)),

            async function StageController_youtubeStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateLiveStreamDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              await templateService.apiHandler({
                methodName: 'youtubeStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/speakers',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SpeakerController)),
            ...(fetchMiddlewares<RequestHandler>(SpeakerController.prototype.createSpeaker)),

            async function SpeakerController_createSpeaker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSpeakerDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SpeakerController();

              await templateService.apiHandler({
                methodName: 'createSpeaker',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/speakers/:speakerId',
            ...(fetchMiddlewares<RequestHandler>(SpeakerController)),
            ...(fetchMiddlewares<RequestHandler>(SpeakerController.prototype.getSpeaker)),

            async function SpeakerController_getSpeaker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    speakerId: {"in":"path","name":"speakerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SpeakerController();

              await templateService.apiHandler({
                methodName: 'getSpeaker',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/speakers/event/:eventId',
            ...(fetchMiddlewares<RequestHandler>(SpeakerController)),
            ...(fetchMiddlewares<RequestHandler>(SpeakerController.prototype.getAllSpeakersForEvent)),

            async function SpeakerController_getAllSpeakersForEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SpeakerController();

              await templateService.apiHandler({
                methodName: 'getAllSpeakersForEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sessions',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.createSession)),

            async function SessionController_createSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSessionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'createSession',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/sessions/:sessionId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.editSession)),

            async function SessionController_editSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateSessionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'editSession',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sessions/organization/:organizationId',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.getOrgEventSessions)),

            async function SessionController_getOrgEventSessions(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'getOrgEventSessions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sessions/search',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.filterSession)),

            async function SessionController_filterSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    search: {"in":"query","name":"search","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'filterSession',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sessions/:organizationSlug/search',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.filterSessionByOrganisation)),

            async function SessionController_filterSessionByOrganisation(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationSlug: {"in":"path","name":"organizationSlug","required":true,"dataType":"string"},
                    search: {"in":"query","name":"search","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'filterSessionByOrganisation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sessions/:sessionId',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.getSessionById)),

            async function SessionController_getSessionById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'getSessionById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sessions/transcriptions',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.sessionTranscriptions)),

            async function SessionController_sessionTranscriptions(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"Pick_UploadSessionDto.organizationId-or-sessionId_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'sessionTranscriptions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/sessions/upload',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.uploadSessionToSocials)),

            async function SessionController_uploadSessionToSocials(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"UploadSessionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'uploadSessionToSocials',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/sessions',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.getAllSessions)),

            async function SessionController_getAllSessions(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    event: {"in":"query","name":"event","dataType":"string"},
                    organization: {"in":"query","name":"organization","dataType":"string"},
                    speaker: {"in":"query","name":"speaker","dataType":"string"},
                    stageId: {"in":"query","name":"stageId","dataType":"string"},
                    onlyVideos: {"in":"query","name":"onlyVideos","dataType":"boolean"},
                    page: {"in":"query","name":"page","dataType":"double"},
                    size: {"in":"query","name":"size","dataType":"double"},
                    timestamp: {"in":"query","name":"timestamp","dataType":"double"},
                    assetId: {"in":"query","name":"assetId","dataType":"string"},
                    published: {"in":"query","name":"published","dataType":"boolean"},
                    type: {"in":"query","name":"type","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'getAllSessions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/sessions/:sessionId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.deleteSession)),

            async function SessionController_deleteSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              await templateService.apiHandler({
                methodName: 'deleteSession',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/schedule/import',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(ScheduleImporterController)),
            ...(fetchMiddlewares<RequestHandler>(ScheduleImporterController.prototype.importSchdeule)),

            async function ScheduleImporterController_importSchdeule(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"Pick_IScheduleImporterDto.url-or-type-or-organizationId_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ScheduleImporterController();

              await templateService.apiHandler({
                methodName: 'importSchdeule',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/schedule/import/stage',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(ScheduleImporterController)),
            ...(fetchMiddlewares<RequestHandler>(ScheduleImporterController.prototype.importSchdeuleByStage)),

            async function ScheduleImporterController_importSchdeuleByStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"Pick_IScheduleImporterDto.url-or-type-or-organizationId-or-stageId_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ScheduleImporterController();

              await templateService.apiHandler({
                methodName: 'importSchdeuleByStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/schedule/import/save',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(ScheduleImporterController)),
            ...(fetchMiddlewares<RequestHandler>(ScheduleImporterController.prototype.save)),

            async function ScheduleImporterController_save(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"organizationId":{"dataType":"string","required":true},"scheduleId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ScheduleImporterController();

              await templateService.apiHandler({
                methodName: 'save',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/organizations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.createOrganization)),

            async function OrganizationController_createOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateOrganizationDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'createOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/organizations/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.editOrganization)),

            async function OrganizationController_editOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateOrganizationDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'editOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/organizations/member/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.updateOrgMembers)),

            async function OrganizationController_updateOrgMembers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"Pick_CreateOrganizationDto.address_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'updateOrgMembers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organizations/:organizationId',
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.getOrganizationById)),

            async function OrganizationController_getOrganizationById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'getOrganizationById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organizations',
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.getAllOrganizations)),

            async function OrganizationController_getAllOrganizations(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'getAllOrganizations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/organizations/member/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.getAllOrgMembers)),

            async function OrganizationController_getAllOrgMembers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'getAllOrgMembers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/organizations/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.deleteOrganization)),

            async function OrganizationController_deleteOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'deleteOrganization',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/organizations/member/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.deleteOrgMember)),

            async function OrganizationController_deleteOrgMember(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"Pick_CreateOrganizationDto.address_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'deleteOrgMember',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/organizations/socials/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.updateOrgSocials)),

            async function OrganizationController_updateOrgSocials(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"ISocials"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'updateOrgSocials',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/organizations/socials/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.deleteOrgSocial)),

            async function OrganizationController_deleteOrgSocial(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"destinationId":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              await templateService.apiHandler({
                methodName: 'deleteOrgSocial',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/collections',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.createNftCollection)),

            async function NftCollectionRouter_createNftCollection(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateNftCollectionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              await templateService.apiHandler({
                methodName: 'createNftCollection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/collections/metadata/generate',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.generateNftMetadata)),

            async function NftCollectionRouter_generateNftMetadata(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateNftCollectionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              await templateService.apiHandler({
                methodName: 'generateNftMetadata',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/collections/:collectionId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.updateNftCollection)),

            async function NftCollectionRouter_updateNftCollection(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateNftCollectionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              await templateService.apiHandler({
                methodName: 'updateNftCollection',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/collections',
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.getAllCollections)),

            async function NftCollectionRouter_getAllCollections(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              await templateService.apiHandler({
                methodName: 'getAllCollections',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/collections/:collectionId',
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.getNftCollectionById)),

            async function NftCollectionRouter_getNftCollectionById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              await templateService.apiHandler({
                methodName: 'getNftCollectionById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/collections/organization/:organizationId',
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.getAllOrganizationNft)),

            async function NftCollectionRouter_getAllOrganizationNft(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              await templateService.apiHandler({
                methodName: 'getAllOrganizationNft',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/markers',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(MarkerController)),
            ...(fetchMiddlewares<RequestHandler>(MarkerController.prototype.createMarker)),

            async function MarkerController_createMarker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMarkerDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarkerController();

              await templateService.apiHandler({
                methodName: 'createMarker',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/markers/bulk',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(MarkerController)),
            ...(fetchMiddlewares<RequestHandler>(MarkerController.prototype.updateMarkers)),

            async function MarkerController_updateMarkers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateMarkerDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarkerController();

              await templateService.apiHandler({
                methodName: 'updateMarkers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/markers/:markerId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(MarkerController)),
            ...(fetchMiddlewares<RequestHandler>(MarkerController.prototype.updateMarker)),

            async function MarkerController_updateMarker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    markerId: {"in":"path","name":"markerId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMarkerDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarkerController();

              await templateService.apiHandler({
                methodName: 'updateMarker',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/markers/import',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(MarkerController)),
            ...(fetchMiddlewares<RequestHandler>(MarkerController.prototype.importMarkers)),

            async function MarkerController_importMarkers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"stageId":{"dataType":"string","required":true},"organizationId":{"dataType":"string","required":true},"type":{"dataType":"string","required":true},"url":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarkerController();

              await templateService.apiHandler({
                methodName: 'importMarkers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/markers',
            ...(fetchMiddlewares<RequestHandler>(MarkerController)),
            ...(fetchMiddlewares<RequestHandler>(MarkerController.prototype.getAllMarkers)),

            async function MarkerController_getAllMarkers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organization: {"in":"query","name":"organization","required":true,"dataType":"string"},
                    stageId: {"in":"query","name":"stageId","required":true,"dataType":"string"},
                    date: {"in":"query","name":"date","dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarkerController();

              await templateService.apiHandler({
                methodName: 'getAllMarkers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/markers/:markerId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(MarkerController)),
            ...(fetchMiddlewares<RequestHandler>(MarkerController.prototype.deleteMarker)),

            async function MarkerController_deleteMarker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    markerId: {"in":"path","name":"markerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new MarkerController();

              await templateService.apiHandler({
                methodName: 'deleteMarker',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/',
            ...(fetchMiddlewares<RequestHandler>(IndexController)),
            ...(fetchMiddlewares<RequestHandler>(IndexController.prototype.index)),

            async function IndexController_index(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new IndexController();

              await templateService.apiHandler({
                methodName: 'index',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/upload',
            authenticateMiddleware([{"jwt":[]}]),
            upload.fields([{"name":"file","maxCount":1,"multiple":false}]),
            ...(fetchMiddlewares<RequestHandler>(IndexController)),
            ...(fetchMiddlewares<RequestHandler>(IndexController.prototype.uploadImges)),

            async function IndexController_uploadImges(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    file: {"in":"formData","name":"file","required":true,"dataType":"file"},
                    directory: {"in":"formData","name":"directory","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new IndexController();

              await templateService.apiHandler({
                methodName: 'uploadImges',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/webhook',
            ...(fetchMiddlewares<RequestHandler>(IndexController)),
            ...(fetchMiddlewares<RequestHandler>(IndexController.prototype.webhook)),

            async function IndexController_webhook(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    livepeerSignature: {"in":"header","name":"livepeer-signature","required":true,"dataType":"string"},
                    payload: {"in":"body","name":"payload","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new IndexController();

              await templateService.apiHandler({
                methodName: 'webhook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/events',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.createEvent)),

            async function EventController_createEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateEventDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'createEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/events/:eventId',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.getEventById)),

            async function EventController_getEventById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'getEventById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/events/:eventId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.editEvent)),

            async function EventController_editEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateEventDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'editEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.put('/events/import/:eventId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.evenImporter)),

            async function EventController_evenImporter(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'evenImporter',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/events',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.getAllEvents)),

            async function EventController_getAllEvents(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"query","name":"organizationId","dataType":"string"},
                    unlisted: {"in":"query","name":"unlisted","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'getAllEvents',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/events/:eventId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.deleteEvent)),

            async function EventController_deleteEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'deleteEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/chats',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ChatController)),
            ...(fetchMiddlewares<RequestHandler>(ChatController.prototype.createCHar)),

            async function ChatController_createCHar(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateChatDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ChatController();

              await templateService.apiHandler({
                methodName: 'createCHar',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/chats/:stageId',
            ...(fetchMiddlewares<RequestHandler>(ChatController)),
            ...(fetchMiddlewares<RequestHandler>(ChatController.prototype.getChatStageById)),

            async function ChatController_getChatStageById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ChatController();

              await templateService.apiHandler({
                methodName: 'getChatStageById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"UserDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/auth/verify-token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyToken)),

            async function AuthController_verifyToken(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"UserDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyToken',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/auth/token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getTokenPayload)),

            async function AuthController_getTokenPayload(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    token: {"in":"header","name":"Authorization","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'getTokenPayload',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
