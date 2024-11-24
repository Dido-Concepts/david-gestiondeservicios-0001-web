'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function PaginationTable (param: { total: number, pageTotal: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const currentPageIndex = Number(searchParams.get('pageIndex')) || 1
  const currentPageSize = Number(searchParams.get('pageSize')) || 10

  const createPageSizeUrl = (pageSize: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('pageSize', pageSize.toString())
    params.set('pageIndex', '1')
    replace(`${pathname}?${params.toString()}`)
  }

  const createNextPageUrl = () => {
    const params = new URLSearchParams(searchParams)
    params.set('pageIndex', (currentPageIndex + 1).toString())
    return `${pathname}?${params.toString()}`
  }

  const createPreviousPageUrl = () => {
    const params = new URLSearchParams(searchParams)
    params.set('pageIndex', (currentPageIndex - 1).toString())
    return `${pathname}?${params.toString()}`
  }

  const createFirstPageUrl = () => {
    const params = new URLSearchParams(searchParams)
    params.set('pageIndex', '1')
    return `${pathname}?${params.toString()}`
  }

  const createLastPageUrl = () => {
    const params = new URLSearchParams(searchParams)
    params.set('pageIndex', param.pageTotal.toString())
    return `${pathname}?${params.toString()}`
  }

  const getCanPreviousPage = () => {
    return currentPageIndex > 1
  }

  const getCanNextPage = () => {
    return currentPageIndex < param.pageTotal
  }

  const startRecord = (currentPageIndex - 1) * currentPageSize + 1
  const endRecord = Math.min(startRecord + currentPageSize - 1, param.total)

  return (
        <div className="w-full px-3 py-4 flex justify-between">
            <div>
                {startRecord} - {endRecord} de {param.total} registros
            </div>
            <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Registro por pagina</p>
                    <Select
                        value={`${currentPageSize}`}
                        onValueChange={(value) => {
                          createPageSizeUrl(value)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={currentPageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Pagina {currentPageIndex} de{' '}
                    {param.pageTotal}
                </div>
                <div className='flex gap-2'>

                    {!getCanPreviousPage()
                      ? (
                            <button className="h-8 w-8 p-0 cursor-not-allowed text-gray-400 " disabled>
                                <DoubleArrowLeftIcon className="h-4 w-4" />
                            </button>
                        )
                      : (
                            <Link href={createFirstPageUrl()} className='h-8 w-8 py-2' >

                                <DoubleArrowLeftIcon className="h-4 w-4" />

                            </Link>
                        )}

                    {!getCanPreviousPage()
                      ? (
                            <button className="h-8 w-8 p-0 cursor-not-allowed text-gray-400 " disabled>
                                <ChevronLeftIcon className="h-4 w-4" />
                            </button>
                        )
                      : (
                            <Link href={createPreviousPageUrl()} className='h-8 w-8 py-2' >

                                <ChevronLeftIcon className="h-4 w-4" />

                            </Link>
                        )
                    }

                    {!getCanNextPage()
                      ? (
                            <button className="h-8 w-8 p-0 cursor-not-allowed text-gray-400 " disabled>
                                <ChevronRightIcon className="h-4 w-4" />
                            </button>
                        )
                      : (
                            <Link href={createNextPageUrl()} className='h-8 w-8 py-2' >

                                <ChevronRightIcon className="h-4 w-4" />

                            </Link>
                        )
                    }

                    {!getCanNextPage()
                      ? (
                            <button className="h-8 w-8 p-0 cursor-not-allowed text-gray-400" disabled>
                                <DoubleArrowRightIcon className="h-4 w-4" />
                            </button>
                        )
                      : (
                            <Link href={createLastPageUrl()} className='h-8 w-8 py-2' >

                                <DoubleArrowRightIcon className="h-4 w-4" />

                            </Link>
                        )
                    }

                </div>
            </div>
        </div>
  )
}
