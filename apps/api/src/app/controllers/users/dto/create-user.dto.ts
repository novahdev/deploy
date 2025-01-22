import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsString({ message: "El nombre de ser una cadena de texto." })
    @IsNotEmpty({ message: "El nombre no debe estar vacío."})
    name: string;

    @IsEmail({}, { message: "Correo electrónico no valido." })
    @MaxLength(50, { message: "El correo electrónico no debe superar los 50 caracteres."})
    email: string;

    @IsString({ message: "La contraseña debe ser una cadena de texto."})
    @MaxLength(30, { message: "La contraseña no puede superar los 30 caracteres." })
    password: string;
}