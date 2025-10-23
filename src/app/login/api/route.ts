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

		// verificar usuario ativo
		if (!user.active) {
			return NextResponse.json(
				{ error: 'Conta não ativada. Por favor, verifique seu email.' },
				{ status: 403 }
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

// GET -> Pega usua spec
export async function GET(request: NextRequest) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get('id');

		if (!id) {
			return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				active: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
		}

		return NextResponse.json(user, { status: 200 });

	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Erro ao buscar usuário.' }, { status: 500 });
	}
}


// PUT -> att usua
export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, name, password, newemail, newtoken } = body;

		if (!email) {
			return NextResponse.json(
				{ error: 'Email é obrigatório.' },
				{ status: 400 }
			);
		}

		let hashedPassword: string | undefined = undefined;
		if (password) {
			hashedPassword = await bcrypt.hash(password, 10);
		}
		if (newemail) {
			const existing = await prisma.user.findUnique({ where: { email: newemail } });
			if (existing) {
				return NextResponse.json({ error: 'Novo email já está em uso.' }, { status: 400 });
			}
		}
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado.' },
				{ status: 404 }
			);
		}
		// Se estiver redefinindo senha, validar o token
		if (newtoken) {
			if (user.activationToken !== newtoken) {
				return NextResponse.json(
					{ error: 'Token inválido.' },
					{ status: 400 }
				);
			}
		}
		const updatedUser = newemail ? await prisma.user.update({
			where: { email },
			data: {
				...(name && { name }),
				...(hashedPassword && { password: hashedPassword }),
				...(newemail && { email: newemail }),
				...(newtoken && { newtoken })
			},
		}) :
			await prisma.user.update({
				where: { email },
				data: {
					...(name && { name }),
					...(hashedPassword && { password: hashedPassword }),
				},
			})

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: 'Erro ao atualizar usuário.' },
			{ status: 500 }
		);
	}
}

// DELETE -> remover usuário por id (cuid)
export async function DELETE(request: NextRequest) {
	try {
		const { id } = await request.json();

		if (!id) {
			return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
		}

		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Usuário deletado com sucesso.' }, { status: 200 });

	} catch (error) {
		if (error === 'P2025') {
			return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
		}

		return NextResponse.json({ error: 'Erro ao deletar usuário.' }, { status: 500 });
	}
}



