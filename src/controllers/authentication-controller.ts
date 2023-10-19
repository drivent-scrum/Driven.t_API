import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { authenticationService, SignInParams } from '@/services';

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  const result = await authenticationService.signIn({ email, password });

  return res.status(httpStatus.OK).send(result);
}

export async function getAccessToken(req: Request, res: Response) {
  const code = req.query.code;
  const params =
    '?client_id=' +
    process.env.GITHUB_CLIENT_ID +
    '&client_secret=' +
    process.env.GITHUB_CLIENT_SECRET +
    '&code=' +
    code;
  await fetch('https://github.com/login/oauth/access_token' + params, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return res.json(data);
    })
    .catch((error) => {
      return res.json(error);
    });
}
