import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
    try {
         
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { message: 'Token is required' },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: { activationToken: token }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid activation token' },
                { status: 404 }
            );
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { 
                active: true,
                activationToken: null
            }
        });

        return NextResponse.json(
            { message: 'Account activated successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}