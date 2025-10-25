import { BaseCalculator } from './base.calculator';
import { EC2Calculator } from './ec2.calculator';
import { S3Calculator } from './s3.calculator';
import { LambdaCalculator } from './lambda.calculator';
import { RDSCalculator } from './rds.calculator';

export class CalculatorFactory {
  static getCalculator(serviceCode: string): BaseCalculator {
    switch (serviceCode.toLowerCase()) {
      case 'ec2':
        return new EC2Calculator();
      case 's3':
        return new S3Calculator();
      case 'lambda':
        return new LambdaCalculator();
      case 'rds':
        return new RDSCalculator();
      // Add more calculators as they are implemented
      default:
        throw new Error(`Calculator not implemented for service: ${serviceCode}`);
    }
  }

  static isSupported(serviceCode: string): boolean {
    const supportedServices = ['ec2', 's3', 'lambda', 'rds'];
    return supportedServices.includes(serviceCode.toLowerCase());
  }

  static getSupportedServices(): string[] {
    return ['ec2', 's3', 'lambda', 'rds'];
  }
}
