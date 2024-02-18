import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/db/supabase.service';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { DB_RESPONSE } from './utils/db-response';
import {
  dataItemCategoria,
  dataItemEmpleado,
  dataItemFamilia,
  dataItemFormaPago,
  dataItemGenero,
  dataItemMarca,
  dataItemProducto,
  dataItemPuesto,
  dataItemSubclase,
  dataItemTienda,
  dataItemTipoPago,
  dataItemTipoUnidad,
} from './queries/proyecto-is2.queries';
import { CreateEmployeeDto } from './dtos/CreateEmployee.dto';
import { decode } from 'base64-arraybuffer';
import { STORAGE_RESPONSE } from './utils/storage-response';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProducto.dto';

const SCHEMA = 'is2';

@Injectable()
export class ProyectoIS2Service {
  private supabase: SupabaseClient<any, 'public', any>;
  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.supabase;
  }

  EMPLEADOS = {
    getEmpleados: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .select(dataItemEmpleado)
        .order('nombre', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'empleados',
        error,
        'Error al obtener empleados',
      ).sendResponse();
    },
    getEmpleadoById: async (id: number) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .select(dataItemEmpleado)
        .eq('id', id)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'empleados',
        error,
        'Error al obtener empleado',
      ).sendResponse();
    },
    postEmpleado: async (empleado: CreateEmployeeDto) => {
      const {
        nombre,
        apellido,
        email,
        telefono,
        idPuesto,
        idGenero,
        alias,
        password,
        salario,
        idTipoPago,
      } = empleado;
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .insert({
          nombre,
          apellido,
          email,
          telefono,
          id_puesto: idPuesto,
          id_genero: idGenero,
          alias,
          password,
          salario,
          id_tipo_pago: idTipoPago,
        })
        .select(dataItemEmpleado)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'registrarEmpleado',
        error,
        'Error al crear empleado',
      ).sendResponse();
    },

    updateEmpleado: async (id: number, empleado: CreateEmployeeDto) => {
      const {
        nombre,
        apellido,
        email,
        telefono,
        idPuesto,
        idGenero,
        alias,
        password,
        salario,
        idTipoPago,
      } = empleado;
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .update({
          nombre,
          apellido,
          email,
          telefono,
          id_puesto: idPuesto,
          id_genero: idGenero,
          alias,
          password,
          salario,
          id_tipo_pago: idTipoPago,
        })
        .eq('id', id)
        .select(dataItemEmpleado)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'actualizar empleado',
        error,
        'Error al actualizar empleado',
      ).sendResponse();
    },

    deleteEmpleado: async (id: number) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .delete()
        .eq('id', id)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'eliminarEmpleado',
        error,
        'Error al eliminar empleado',
      ).sendResponse();
    },

    updateStatusAndObservacionesEmpleado: async (
      id: number,
      inhabilitado: boolean,
      observaciones: string,
    ) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .update({ inhabilitado, observaciones })
        .eq('id', id)
        .select(dataItemEmpleado)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'inhabilitarEmpleado',
        error,
        'Error al inhabilitar empleado',
      ).sendResponse();
    },
    uploadImageToEmpleado: async (id: number, imageBase64: string) => {
      const [, base64] = imageBase64.split(',');
      const ArrayBufferImage = decode(base64);

      const { data, error } = await this.supabase.storage
        .from('is_documents_and_files')
        .upload(`empleados/${id}.jpeg`, ArrayBufferImage, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      return new STORAGE_RESPONSE<typeof data>(
        data,
        'uploadImageToEmpleado',
        error,
        'Error al subir imagen',
      ).sendResponse();
    },
  };

  LOGIN = {
    loginUser: async (emailOrAlias: string, password: string) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('empleados')
        .select(dataItemEmpleado)
        .or(`email.eq.${emailOrAlias},alias.eq.${emailOrAlias}`)
        .eq('password', password)
        .single();

      if (!data) {
        return new DB_RESPONSE<typeof data>(
          data,
          'login',
          {
            message: 'Usuario o contraseña incorrectos',
            details: '',
            hint: '',
            code: '500',
          } as PostgrestError,
          'Usuario o contraseña incorrectos',
        ).sendResponse();
      }

      return new DB_RESPONSE<typeof data>(
        data,
        'login',
        error,
        'Se ha logueado correctamente',
      ).sendResponse();
    },
  };

  PUESTOS = {
    getPuestos: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('puestos')
        .select(dataItemPuesto)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'puestos',
        error,
        'Error al obtener puestos',
      ).sendResponse();
    },
  };

  GENEROS = {
    getGeneros: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('generos')
        .select(dataItemGenero)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'generos',
        error,
        'Error al obtener generos',
      ).sendResponse();
    },
  };

  TIPO_PAGO = {
    getTipoPago: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('tipos_pago')
        .select(dataItemTipoPago)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'tiposPago',
        error,
        'Error al obtener tipos de pago',
      ).sendResponse();
    },
  };

  FORMA_PAGO = {
    getFormaPago: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('formas_pago')
        .select(dataItemFormaPago)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'formasPago',
        error,
        'Error al obtener formas de pago',
      ).sendResponse();
    },
  };

  FAMILIAS = {
    getFamilias: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('familias')
        .select(dataItemFamilia)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'familias',
        error,
        'Error al obtener familias',
      ).sendResponse();
    },
  };

  CATEGORIAS = {
    getCategorias: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('categorias')
        .select(dataItemCategoria)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'categorias',
        error,
        'Error al obtener categorias',
      ).sendResponse();
    },
  };

  SUBCLASES = {
    getSubclases: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('subclases')
        .select(dataItemSubclase)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'subclases',
        error,
        'Error al obtener subclases',
      ).sendResponse();
    },
  };

  TIENDAS = {
    getTiendas: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('tiendas')
        .select(dataItemTienda)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'tiendas',
        error,
        'Error al obtener tiendas',
      ).sendResponse();
    },
  };

  MARCAS = {
    getMarcas: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('marcas')
        .select(dataItemMarca)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'marcas',
        error,
        'Error al obtener marcas',
      ).sendResponse();
    },
  };

  PRODUCTOS = {
    getProductos: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('productos')
        .select(dataItemProducto)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'productos',
        error,
        'Error al obtener productos',
      ).sendResponse();
    },

    getProductoById: async (id: number) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('productos')
        .select(dataItemProducto)
        .eq('id', id)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'productos',
        error,
        'Error al obtener producto',
      ).sendResponse();
    },

    postProducto: async (producto: CreateProductDto) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('productos')
        .insert({
          descripcion: producto.descripcion,
          id_subclase: producto.idSubclase,
          id_marca: producto.idMarca,
        })
        .select(dataItemProducto)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'nuevoProducto',
        error,
        'Error al crear producto',
      ).sendResponse();
    },

    updateProducto: async (id: number, producto: UpdateProductDto) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('productos')
        .update({
          descripcion: producto.descripcion,
          id_marca: producto.idMarca,
          inhabilitado: producto.inhabilitado,
          oferta: producto.oferta,
        })
        .eq('id', id)
        .select(dataItemProducto)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'actualizarProducto',
        error,
        'Error al actualizar producto',
      ).sendResponse();
    },

    deleteProducto: async (id: number) => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('productos')
        .delete()
        .eq('id', id)
        .single();

      return new DB_RESPONSE<typeof data>(
        data,
        'eliminarProducto',
        error,
        'Error al eliminar producto',
      ).sendResponse();
    },
  };

  TIPOS_UNIDADES = {
    getTiposUnidades: async () => {
      const { data, error } = await this.supabase
        .schema(SCHEMA)
        .from('tipos_unidades')
        .select(dataItemTipoUnidad)
        .order('id', { ascending: true });

      return new DB_RESPONSE<typeof data>(
        data,
        'tiposUnidades',
        error,
        'Error al obtener tipos de unidades',
      ).sendResponse();
    },
  };
}