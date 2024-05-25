import jwt from 'jsonwebtoken';

class jwtService {
    public isAdministrator(token: string) {
        if (typeof token === 'string') {
            const tokenDecoded = token.replace(/"/g, '');
            const data: any = jwt.decode(tokenDecoded);

            if (data.role !== 'administrator') {
                return false;
            }

            return true;
        }
    }
    public isAsesor (token: string) {
        if (typeof token === 'string') {
            const tokenDecoded = token.replace(/"/g, '');
            const data: any = jwt.decode(tokenDecoded);

            if (data.role !== 'asesor') {
                return false;
            }

            return true;
        }

    }

    public getUserId(token: string) {
        if (typeof token === 'string') {
            const tokenDecoded = token.replace(/"/g, '');
            const data: any = jwt.decode(tokenDecoded);

            return data.id;
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
const JwtService = new jwtService();
export default JwtService;