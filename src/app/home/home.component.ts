import { Component, OnInit } from '@angular/core';
import { FoodService } from '../_services/food.service';
import { MenuService } from '../_services/menu.service';
import { TokenStorageService } from '../_services/token-storage.service';

interface orderType {
  _id: string
  foodName: string
  price?: number
  quantity?: number
  total?: number
}

interface totalAmountType {subTotal?: string,
  tax?: string,
  estimatedTotal?: string}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: string
  menuItems: {foodName?: string
  price?: string}[] = []
  totalAmount:totalAmountType  = {}
  orderData: orderType = {foodName : '', _id: ''}
  orders: orderType[] = []
  range = 10
  errorMessage = ''
  userId = ''

  constructor(private FoodService: FoodService, private MenuService: MenuService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.userId = this.tokenStorage.getUser().id
    this.FoodService.getOrderCount(this.userId).subscribe({
      next: (data: orderType[] ) => {
        this.orders = data
      },
      error: err => {
        this.content = JSON.parse(err.error).message
      }
    })
    this.MenuService.getMenu().subscribe({
      next: data => {
        this.menuItems = data
      },
      error: err => {
        this.content = JSON.parse(err.error).message
      }
    })
    this.FoodService.getOrderTotal(this.userId).subscribe({
      next: (data: totalAmountType ) => {
        this.totalAmount = data
      },
      error: err => {
        this.content = JSON.parse(err.error).message
      }
    })
  }

  reloadPage(): void {
    window.location.reload()
  }

  createOrder(): void {
    const {foodName, quantity} = this.orderData
    const foodNameArr = foodName.split(',')
    this.FoodService.postOrder(foodNameArr[0], Number(foodNameArr[1]), quantity, this.userId).subscribe({
      next: (data:any) => {
        this.reloadPage()
      },
      error: (err: any) => {
        this.errorMessage = err.error.message
      }
    })
  }

  deleteOrder(id:string): void {
    this.FoodService.deleteOrder(id, this.userId).subscribe({
      next: (data:any) => {
        this.reloadPage()
      },
      error: (err: any) => {
        this.errorMessage = err.error.message
      }
    })
  }

}
