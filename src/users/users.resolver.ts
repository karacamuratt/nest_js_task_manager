import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => User)
  async createUser(@Args('input') createUserInput: CreateUserInput) {
    return this.prisma.user.create({ data: createUserInput });
  }

  @Query(() => [User], { name: 'users' })
  async getUsers() {
    return this.prisma.user.findMany();
  }
}
