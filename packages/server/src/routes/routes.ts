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
import { OrganizationController } from './../controllers/organization.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NftCollectionRouter } from './../controllers/nft.controller';
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

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "mongoose.Types.ObjectId": {
        "dataType": "refAlias",
        "type": {"dataType":"string","validators":{}},
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
            "walletAddress": {"dataType":"string","required":true},
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
            "walletAddress": {"dataType":"string","required":true},
            "organizations": {"dataType":"array","array":{"dataType":"refObject","ref":"IOrganization"}},
            "role": {"ref":"UserRole"},
            "signature": {"dataType":"string","required":true},
            "nonce": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
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
    "SheetType": {
        "dataType": "refEnum",
        "enums": ["gsheet","pretalx"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StateStatus": {
        "dataType": "refEnum",
        "enums": ["pending","completed","canceled","sync"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StateType": {
        "dataType": "refEnum",
        "enums": ["event","video"],
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
            "id": {"dataType":"string"},
            "name": {"dataType":"string"},
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
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "thumbnail": {"dataType":"string"},
            "streamDate": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"string"}]},
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
            "organizationId": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string"},
            "streamDate": {"dataType":"datetime"},
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
            "streamSettings": {"ref":"IStreamSettings"},
            "plugins": {"dataType":"array","array":{"dataType":"refObject","ref":"IPlugin"}},
            "order": {"dataType":"double"},
            "organizationId": {"dataType":"string","required":true},
            "slug": {"dataType":"string"},
            "streamDate": {"dataType":"string"},
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
    "ISession": {
        "dataType": "refObject",
        "properties": {
            "_id": {"ref":"mongoose.Types.ObjectId"},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "start": {"dataType":"double","required":true},
            "end": {"dataType":"double","required":true},
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
            "nftURI": {"dataType":"string"},
            "ipfsURI": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "type": {"ref":"SessionType","required":true},
            "createdAt": {"dataType":"string"},
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
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"organizationId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},"name":{"dataType":"string","required":true},"eventId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},"slug":{"dataType":"string"},"description":{"dataType":"string","required":true},"start":{"dataType":"double","required":true},"end":{"dataType":"double","required":true},"stageId":{"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}]},"speakers":{"dataType":"array","array":{"dataType":"refAlias","ref":"Omit_ISpeaker.organizationId_"}},"source":{"ref":"ISource"},"assetId":{"dataType":"string"},"playback":{"ref":"IPlayback"},"videoUrl":{"dataType":"string"},"playbackId":{"dataType":"string"},"track":{"dataType":"array","array":{"dataType":"string"}},"coverImage":{"dataType":"string"},"eventSlug":{"dataType":"string"},"videoTranscription":{"dataType":"string"},"aiDescription":{"dataType":"string"},"autoLabels":{"dataType":"array","array":{"dataType":"string"}},"nftURI":{"dataType":"string"},"ipfsURI":{"dataType":"string"},"published":{"dataType":"boolean"},"type":{"ref":"SessionType","required":true},"createdAt":{"dataType":"string"}},"validators":{}},
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
            "nftURI": {"dataType":"string"},
            "ipfsURI": {"dataType":"string"},
            "published": {"dataType":"boolean"},
            "type": {"ref":"SessionType","required":true},
            "createdAt": {"dataType":"string"},
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
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true},"bio":{"dataType":"string"},"slug":{"dataType":"string"},"description":{"dataType":"string"},"email":{"dataType":"string","required":true},"url":{"dataType":"string"},"logo":{"dataType":"string","required":true},"location":{"dataType":"string"},"accentColor":{"dataType":"string"},"banner":{"dataType":"string"},"walletAddress":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateOrganizationDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "bio": {"dataType":"string"},
            "slug": {"dataType":"string"},
            "description": {"dataType":"string"},
            "email": {"dataType":"string","required":true},
            "url": {"dataType":"string"},
            "logo": {"dataType":"string","required":true},
            "location": {"dataType":"string"},
            "accentColor": {"dataType":"string"},
            "banner": {"dataType":"string"},
            "walletAddress": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateOrganizationDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "logo": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "walletAddress": {"dataType":"string","required":true},
            "organizationId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_CreateOrganizationDto.walletAddress_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"walletAddress":{"dataType":"string","required":true}},"validators":{}},
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
    "NftCollectionType": {
        "dataType": "refEnum",
        "enums": ["single","multiple"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "INftCollection": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string","required":true},
            "type": {"ref":"NftCollectionType","required":true},
            "organizationId": {"dataType":"union","subSchemas":[{"ref":"mongoose.Types.ObjectId"},{"dataType":"string"}],"required":true},
            "videos": {"dataType":"any","required":true},
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
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "thumbnail": {"dataType":"string","required":true},
            "type": {"ref":"NftCollectionType","required":true},
            "organizationId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"ref":"mongoose.Types.ObjectId"}],"required":true},
            "videos": {"dataType":"any","required":true},
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
            "walletAddress": {"dataType":"string","required":true},
            "signature": {"dataType":"string","required":true},
            "nonce": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IStandardResponse_boolean_": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthDto": {
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

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        app.get('/users/:walletAddress',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserById)),

            function UserController_getUserById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    walletAddress: {"in":"path","name":"walletAddress","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new UserController();

              templateService.apiHandler({
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

            function SupportController_createTicket(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSupportTicketDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SupportController();

              templateService.apiHandler({
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

            function SupportController_getAllTickets(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SupportController();

              templateService.apiHandler({
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
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.createMultiStream)),

            function StreamController_createMultiStream(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateMultiStreamDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              templateService.apiHandler({
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
            ...(fetchMiddlewares<RequestHandler>(StreamController)),
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.deleteMultiStream)),

            function StreamController_deleteMultiStream(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"DeleteMultiStreamDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              templateService.apiHandler({
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

            function StreamController_createAsset(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              templateService.apiHandler({
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

            function StreamController_getStream(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    streamId: {"in":"path","name":"streamId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              templateService.apiHandler({
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
            ...(fetchMiddlewares<RequestHandler>(StreamController.prototype.getVideoUrl)),

            function StreamController_getVideoUrl(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    assetId: {"in":"path","name":"assetId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StreamController();

              templateService.apiHandler({
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
        app.post('/states',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StateController)),
            ...(fetchMiddlewares<RequestHandler>(StateController.prototype.createState)),

            function StateController_createState(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateStateDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StateController();

              templateService.apiHandler({
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

            function StateController_updateState(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stateId: {"in":"path","name":"stateId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateStateDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StateController();

              templateService.apiHandler({
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

            function StateController_getAllStates(request: ExRequest, response: ExResponse, next: any) {
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

              templateService.apiHandler({
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

            function StageController_createStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateStageDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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
        app.put('/stages/:stageId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(StageController)),
            ...(fetchMiddlewares<RequestHandler>(StageController.prototype.editStage)),

            function StageController_editStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateStageDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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

            function StageController_getStageById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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

            function StageController_getAllStages(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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

            function StageController_getAllStagesForEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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

            function StageController_getAllStagesForOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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

            function StageController_deleteStage(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new StageController();

              templateService.apiHandler({
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
        app.post('/speakers',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(SpeakerController)),
            ...(fetchMiddlewares<RequestHandler>(SpeakerController.prototype.createSpeaker)),

            function SpeakerController_createSpeaker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSpeakerDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SpeakerController();

              templateService.apiHandler({
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

            function SpeakerController_getSpeaker(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    speakerId: {"in":"path","name":"speakerId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SpeakerController();

              templateService.apiHandler({
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

            function SpeakerController_getAllSpeakersForEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SpeakerController();

              templateService.apiHandler({
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

            function SessionController_createSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateSessionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
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
        app.post('/sessions/metadata/:sessionId',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.uploadSessionMetadata)),

            function SessionController_uploadSessionMetadata(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
                methodName: 'uploadSessionMetadata',
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

            function SessionController_editSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateSessionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
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
        app.get('/sessions/:sessionId',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.getSessionById)),

            function SessionController_getSessionById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
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
        app.post('/sessions/upload/:sessionId',
            ...(fetchMiddlewares<RequestHandler>(SessionController)),
            ...(fetchMiddlewares<RequestHandler>(SessionController.prototype.uploadSessionToYouTube)),

            function SessionController_uploadSessionToYouTube(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
                    googleToken: {"in":"query","name":"googleToken","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
                methodName: 'uploadSessionToYouTube',
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

            function SessionController_getAllSessions(request: ExRequest, response: ExResponse, next: any) {
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
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
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

            function SessionController_deleteSession(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    sessionId: {"in":"path","name":"sessionId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new SessionController();

              templateService.apiHandler({
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
        app.post('/organizations',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.createOrganization)),

            function OrganizationController_createOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateOrganizationDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              templateService.apiHandler({
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

            function OrganizationController_editOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateOrganizationDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              templateService.apiHandler({
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
        app.put('/organizations/members/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.updateOrgMembers)),

            function OrganizationController_updateOrgMembers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"Pick_CreateOrganizationDto.walletAddress_"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              templateService.apiHandler({
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

            function OrganizationController_getOrganizationById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              templateService.apiHandler({
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

            function OrganizationController_getAllOrganizations(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              templateService.apiHandler({
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
        app.delete('/organizations/:organizationId',
            authenticateMiddleware([{"jwt":["org"]}]),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController)),
            ...(fetchMiddlewares<RequestHandler>(OrganizationController.prototype.deleteOrganization)),

            function OrganizationController_deleteOrganization(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
                    _organizationId: {"in":"body","name":"_organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new OrganizationController();

              templateService.apiHandler({
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
        app.post('/collections',
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.createNftCollection)),

            function NftCollectionRouter_createNftCollection(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateNftCollectionDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              templateService.apiHandler({
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
        app.get('/collections',
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter)),
            ...(fetchMiddlewares<RequestHandler>(NftCollectionRouter.prototype.getAllCollections)),

            function NftCollectionRouter_getAllCollections(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              templateService.apiHandler({
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

            function NftCollectionRouter_getNftCollectionById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    collectionId: {"in":"path","name":"collectionId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              templateService.apiHandler({
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

            function NftCollectionRouter_getAllOrganizationNft(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"path","name":"organizationId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new NftCollectionRouter();

              templateService.apiHandler({
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
        app.get('/',
            ...(fetchMiddlewares<RequestHandler>(IndexController)),
            ...(fetchMiddlewares<RequestHandler>(IndexController.prototype.index)),

            function IndexController_index(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new IndexController();

              templateService.apiHandler({
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
        app.post('/webhook',
            ...(fetchMiddlewares<RequestHandler>(IndexController)),
            ...(fetchMiddlewares<RequestHandler>(IndexController.prototype.webhook)),

            function IndexController_webhook(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    livepeerSignature: {"in":"header","name":"livepeer-signature","required":true,"dataType":"string"},
                    payload: {"in":"body","name":"payload","required":true,"dataType":"any"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new IndexController();

              templateService.apiHandler({
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

            function EventController_createEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateEventDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              templateService.apiHandler({
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

            function EventController_getEventById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              templateService.apiHandler({
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

            function EventController_editEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                    body: {"in":"body","name":"body","required":true,"ref":"UpdateEventDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              templateService.apiHandler({
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

            function EventController_evenImporter(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              templateService.apiHandler({
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

            function EventController_getAllEvents(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    organizationId: {"in":"query","name":"organizationId","dataType":"string"},
                    unlisted: {"in":"query","name":"unlisted","dataType":"boolean"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              templateService.apiHandler({
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

            function EventController_deleteEvent(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                    organizationId: {"in":"body","name":"organizationId","required":true,"ref":"OrgIdDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new EventController();

              templateService.apiHandler({
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

            function ChatController_createCHar(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"CreateChatDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ChatController();

              templateService.apiHandler({
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

            function ChatController_getChatStageById(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    stageId: {"in":"path","name":"stageId","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ChatController();

              templateService.apiHandler({
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

            function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"ref":"UserDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              templateService.apiHandler({
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
        app.get('/auth/nonce/generate',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.generateNonce)),

            function AuthController_generateNonce(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              templateService.apiHandler({
                methodName: 'generateNonce',
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
        app.post('/auth/verify-token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyToken)),

            function AuthController_verifyToken(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    token: {"in":"body","name":"token","required":true,"ref":"AuthDto"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              templateService.apiHandler({
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
