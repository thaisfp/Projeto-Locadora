"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { Cliente } from "@/model/cliente";
import { useDependenteHook } from "@/hooks/dependente";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PropsCliente {
  cliente?: Cliente;
}

export function FormNovoCliente({ cliente }: PropsCliente) {
  const { criarDependente, editarDependente } = useDependenteHook();
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = z.object({
    nome: z
      .string({ required_error: "Nome do Ator é obrigatório!" })
      .min(2, { message: "Número insuficiente de caracteres" }),
    numInscricao: z.coerce
      .number({ required_error: "Número da Inscrição é obrigatório!" })
      .min(3, { message: "Quantidade de dígitos insuficientes" }),
    dtNascimento: z.coerce
      .date({
        errorMap: ({ code }, { defaultError }) => {
          if (code === "invalid_date")
            return { message: "Data de Nascimento é obrigatória" };
          return { message: defaultError };
        },
      })
      .refine(
        (data) => {
          return data < new Date();
        },
        { message: "Data de Nascimento deve ser menor que a atual" }
      ),
    sexo: z.string({ required_error: "Campo Sexo é obrigatório!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: cliente
      ? {
          numInscricao: cliente.numInscricao || undefined,
          nome: cliente.nome || "",
          dtNascimento: cliente.dtNascimento || undefined,
          sexo: cliente.sexo || "",
        }
      : {},
  });

  function gerarNumeroInscricaoAleatorio() {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  useEffect(() => {
    form.setValue("numInscricao", gerarNumeroInscricaoAleatorio());
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (cliente) {
        const editDependente = {
          nome: values.nome,
          numInscricao: values.numInscricao,
          sexo: values.sexo,
          dtNascimento: values.dtNascimento,
          estahAtivo: cliente.estahAtivo,
        };

        await editarDependente(editDependente).then((res) => {
          console.log(res);

          toast({
            title: "Sucesso!",
            description: "Cliente editado com sucesso",
          });
          window.location.reload();
        });
      } else {
        const novoDependente = {
          nome: values.nome,
          numInscricao: values.numInscricao,
          sexo: values.sexo,
          dtNascimento: values.dtNascimento,
          estahAtivo: true,
        };

        await criarDependente(novoDependente).then((res) => {
          console.log(res);

          toast({
            title: "Sucesso!",
            description: "cliente criado com sucesso",
          });
          window.location.reload();
        });
      }

      setIsOpen(false);
    } catch {
      toast({
        title: "Erro!",
        description: "Erro ao criar/editar cliente",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {cliente ? (
          <Button
            variant="outline"
            className="bg-slate-300 hover:bg-sky-700 shadow-md w-full text-lg text-slate-50 hover:text-white"
          >
            <UserPen />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-sky-700 shadow-md w-1/6 text-lg text-slate-50 hover:bg-slate-400 "
          >
            Novo Cliente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex h-alto items-center justify-start">
                <div className="w-full flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="numInscricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Inscrição</FormLabel>
                        <FormControl>
                          <Input
                          disabled
                            type="number"
                            className="border border-[#A7A7A7] "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input
                            className="border border-[#A7A7A7] "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dtNascimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="border border-[#A7A7A7] "
                            {...field}
                            value={
                              field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : field.value
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sexo"
                    render={({ field }) => (
                      <FormItem className="flex-col">
                        <FormLabel>Sexo</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-row gap-5"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="M" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Masculino
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="F" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Feminino
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full items-center justify-center gap-5">
                <Button
                  type="submit"
                  className="bg-sky-700 shadow-md w-1/2 text-lg hover:bg-slate-400 "
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  className="bg-slate-400  shadow-md w-1/2 text-lg "
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}