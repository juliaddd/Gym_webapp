from pydantic import BaseModel, constr

class CategoryBase(BaseModel):
    name: constr(max_length=15, strip_whitespace=True)

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    category_id: int

    class Config:
        from_attributes = True