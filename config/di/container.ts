import { CustomerModule } from '@/modules/customer/infra/provider/customer.provider'
import { LocationModule } from '@/modules/location/infra/provider/location.provider'
import { ServiceModule } from '@/modules/service/infra/provider/service.provider'
import { UserModule } from '@/modules/user/infra/provider/user.provider'
import { UserLocationModule } from '@/modules/user-location/infra/provider/user-location.provider'
import { DaysOffModule } from '@/modules/days-off/infra/provider/days-off.provider'
import { ShiftModule } from '@/modules/shift/infra/provider/shift.provider'
import { RoleModule } from '@/modules/role/infra/provider/role.provider'
import { Container } from 'inversify'
import 'reflect-metadata'

const container = new Container()

container.load(UserModule)
container.load(LocationModule)
container.load(CustomerModule)
container.load(ServiceModule)
container.load(UserLocationModule)
container.load(DaysOffModule)
container.load(ShiftModule)
container.load(RoleModule)

export default container
