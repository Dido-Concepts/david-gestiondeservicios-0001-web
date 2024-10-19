import { UserModule } from '@/modules/user/infra/provider/user.provider'
import { Container } from 'inversify'
import 'reflect-metadata'

const container = new Container()

container.load(UserModule)

export default container
