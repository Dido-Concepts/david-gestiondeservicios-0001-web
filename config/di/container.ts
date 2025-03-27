import { LocationModule } from '@/modules/location/infra/provider/location.provider'
import { UserModule } from '@/modules/user/infra/provider/user.provider'
import { Container } from 'inversify'
import 'reflect-metadata'

const container = new Container()

container.load(UserModule)
container.load(LocationModule)

export default container
