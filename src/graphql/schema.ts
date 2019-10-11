import {GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';

import {conn as Db} from '../conn'

const User = new GraphQLObjectType({
  name: 'User',
  description: 'User',
  fields () {
    return {
      name: {
        type: GraphQLString,
        resolve (user) {
          return user.name;
        }
      },
			email: {
				type: GraphQLString,
				resolve (user) {
					return user.email;
				}
			},
			password: {
				type: GraphQLString,
				resolve (user) {
					return user.password;
				}
			},
			bonusAddress: {
				type: GraphQLString,
				resolve (user) {
					return user.bonusAddress;
				}
			},
			img: {
				type: GraphQLString,
				resolve (user) {
					return user.img;
				}
			},
      type: {
        type: GraphQLString,
        resolve (user) {
          return user.type;
        }
      },
			activated: {
				type: GraphQLBoolean,
				resolve (user) {
					return user.activated;
				}
			}
    };
  }
});


const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query object',
  fields: () => {
    return {
      posts: {
        type: new GraphQLList(User),
        resolve (root, args) {
          return Db.models.users.findAll({ where: args });
        }
      }
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Functions to set stuff',
  fields () {
    return {
      addUser: {
        type: User,
        args: {
          firstName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          lastName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          email: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return Db.models.users.create({
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email.toLowerCase()
          });
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
