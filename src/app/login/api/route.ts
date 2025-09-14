import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email e senha são obrigatórios.' },
				{ status: 400 }
			);
		}

		// Bate email
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json(
				{ error: 'Credenciais inválidas.' },
				{ status: 401 }
			);
		}

		// Bate a senha c/ hash na base
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return NextResponse.json(
				{ error: 'Credenciais inválidas.' },
				{ status: 401 }
			);
		}

		// login Ok
		return NextResponse.json(
			{ message: 'Login realizado com sucesso!', user: { id: user.id, name: user.name, email: user.email } },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor.' },
			{ status: 500 }
		);
	}
}
