export class NestedTestClass {
   private field: string

   constructor (field: string) {
      this.field = field
   }

   public getField (): string {
      return this.field
   }
}

export class SimpleTestClass {
   private nestedTestClass: NestedTestClass

   constructor (nestedTestClass: NestedTestClass) {
      this.nestedTestClass = nestedTestClass
   }

   public getField (): string {
      return this.nestedTestClass.getField()
   }
}
