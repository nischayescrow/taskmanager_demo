import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private heavyInterval: NodeJS.Timeout | null = null;

  getHello(): string {
    this.logger.warn('Welcome to Taks Manager!');
    this.logger.log('Home route!');
    return 'Task Manager: Jay Shree Krishna!';
  }

  async getUsers(limit: number = 10, page: number = 1) {
    try {
      const skip = (page - 1) * limit;

      this.logger.log('Fetching Todo data....');

      const data = await axios.get(
        'https://jsonplaceholder.typicode.com/todos',
      );

      return { data: data.data.slice(skip, skip + limit) ?? [] };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async doHeavyTask(times: number = 1) {
    try {
      this.logger.warn('Heavy Task!!');
      const n = 50000000;
      let sum = 0;

      this.logger.log('Doing heavy task....');

      for (let t = 0; t < times; t++) {
        for (let i = 0; i < n; i++) {
          sum += Math.sqrt(i) * Math.sin(i);

          if (i % 1000 === 0) {
            await new Promise((resolve) => setImmediate(resolve));
          }
        }

        await new Promise((resolve) => setImmediate(resolve));
      }

      this.logger.log('Heavy task completed successfully!');
      return { status: 'done', result: sum };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async doHeavyTaskInterval(action: 0 | 1) {
    console.log('action: ', action);

    try {
      const n = 50000000;
      let sum = 0;

      if (!this.heavyInterval && action === 1) {
        this.heavyInterval = setInterval(async () => {
          for (let i = 0; i < n; i++) {
            sum += Math.sqrt(i) * Math.sin(i);

            if (i % 1000 === 0) {
              await new Promise((resolve) => setImmediate(resolve));
              console.log('interval running...', i);
            }
          }

          await new Promise((resolve) => setImmediate(resolve));
        }, 30000);
      } else if (this.heavyInterval && action === 0) {
        console.log('interval cleared!!');
        clearInterval(this.heavyInterval);
        this.heavyInterval = null;
      }

      return { status: 'done' };
    } catch (error) {
      console.log(error);

      if (this.heavyInterval) {
        clearInterval(this.heavyInterval);
        this.heavyInterval = null;
      }

      throw error;
    }
  }

  async generateError(code: number) {
    console.log('code: ', code);

    try {
      switch (code) {
        case 500: {
          throw new InternalServerErrorException();
        }

        case 401:
          throw new UnauthorizedException();

        case 400:
          throw new BadRequestException();

        case 429:
          throw new HttpException(
            'Too many Requests',
            HttpStatus.TOO_MANY_REQUESTS,
          );

        default:
          throw new HttpException(
            'Somthing Wrong here!!',
            HttpStatus.SEE_OTHER,
          );
      }
    } catch (error: any) {
      console.log(error);

      this.logger.error(`Opps we got error! : ${error.message}`);

      throw error;
    }
  }
}
