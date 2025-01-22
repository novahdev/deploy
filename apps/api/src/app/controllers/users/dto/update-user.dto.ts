import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateUserDto {
    @IsString({ message: "El nombre de ser una cadena de texto." })
    @IsNotEmpty({ message: "El nombre no debe estar vacío."})
    @IsOptional()
    name?: string;

    @IsEmail({}, { message: "Correo electrónico no valido." })
    @MaxLength(50, { message: "El correo electrónico no debe superar los 50 caracteres."})
    @IsOptional()
    email?: string;
}