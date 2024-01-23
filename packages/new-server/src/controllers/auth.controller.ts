// import { Controller, Get, Route, Tags, SuccessResponse, Request, Body, Post } from 'tsoa';
// import * as express from 'express';
// import { AuthService } from '@services/auth.service';
// import { IStandardResponse, SendApiResponse } from '@utils/api.response';
// @Tags('Auth')
// @Route('auth')
// class AuthController extends Controller {
//   private authService = new AuthService();
//   @SuccessResponse('200')
//   @Get()
//   async generateNonce(
//     @Request() req: express.Request,
//   ): Promise<IStandardResponse<string>> {
//     const nonce = await this.authService.generate();
//     req.session.nonce = nonce;
//     return SendApiResponse('nonce generated', nonce);
//   }

//   @SuccessResponse('201')
//   @Post()
//   async verifySignature(@Body() message:string, @Body() nonce:string, @Request() req:express.Request){
//     const signature = await this.authService.verify(message, nonce)
//     req.session.siwe =signature.messages
//     req.session.cookie.expires = signature.expiryTime
//     return SendApiResponse('siganture verified', signature)
//   }
// }
