import { Mapper } from '@/modules/share/domain/mapper'
import { CustomerEntity } from '@/modules/customer/infra/repositories/entities/customer.entity'
import { CustomerModel } from '@/modules/customer/domain/models/customer.model'

export class CustomerMapper extends Mapper<
CustomerEntity,
CustomerModel
> {
  mapFrom (param: CustomerEntity): CustomerModel {
    console.log(param.birthdate_customer)
    return {
      id: param.id,
      name: param.name_customer,
      email: param.email_customer,
      phone: param.phone_customer,
      birthDate: new Date(param.birthdate_customer + ' GMT-0500'),
      status: param.status_customer,
      createdAt: param.insert_date
    }
  }

  mapTo (param: CustomerModel): CustomerEntity {
    return {
      id: param.id,
      name_customer: param.name,
      email_customer: param.email,
      phone_customer: param.phone,
      birthdate_customer: param.birthDate.toISOString(),
      status_customer: param.status,
      insert_date: param.createdAt
    }
  }
}
