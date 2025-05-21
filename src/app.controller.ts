import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    getCategories() {
        return {
            data: "Empty"
        }
    }
}
