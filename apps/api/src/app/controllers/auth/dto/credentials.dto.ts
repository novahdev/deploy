import { IsEmail, IsString, MaxLength } from "class-validator";

export class CredentialsDto {

    @IsEmail({}, { message: "El correo electrónico no es válido." })
    @MaxLength(100, { message: "El nombre de usuario no puede superar los 100 caracteres." })
    username: string;

    @IsString({ message: "La contraseña debe ser un texto." })
    @MaxLength(50, { message: "La contraseña no puede superar los 50 caracteres." })
    password: string;
}