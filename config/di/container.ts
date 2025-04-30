import { CustomerModule } from '@/modules/customer/infra/provider/customer.provider'
import { LocationModule } from '@/modules/location/infra/provider/location.provider'
import { ServiceModule } from '@/modules/service/infra/provider/service.provider'
import { UserModule } from '@/modules/user/infra/provider/user.provider'
import { Container } from 'inversify'
import 'reflect-metadata'

const container = new Container()

container.load(UserModule)
container.load(LocationModule)
container.load(CustomerModule)
container.load(ServiceModule)

export default container
