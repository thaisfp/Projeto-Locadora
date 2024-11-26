import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { toast } from "@/components/ui/use-toast";
  import { useLocacaoHook } from "@/hooks/locacao"; // Alterar para o hook que manipula as locações
  import { Trash2 } from "lucide-react";
  import { useRouter } from "next/navigation";
  
  interface IdLocacaoProps {
    locacaoId: string;
  }
  
  export function DialogDeletarLocacao({ locacaoId }: IdLocacaoProps) {
    const { deletarLocacao } = useLocacaoHook(); // Hook responsável pela lógica de exclusão da locação
    const router = useRouter();
  
    async function removerLocacao(locacaoId: string) {
      deletarLocacao(locacaoId)
        .then((response) => {
          router.refresh(); // Atualiza a página após a remoção
          toast({
            title: "Sucesso!",
            description: "A locação foi removida com sucesso!",
          });
        })
        .catch((error) => {
          toast({
            title: "Erro!",
            description:
              "Não foi possível remover esta locação. Verifique se ela está ativa ou tente novamente mais tarde.",
            variant: "destructive",
          });
        });
    }
  
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button className="bg-slate-300 hover:bg-sky-700 shadow-lg">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja remover esta locação?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-5">
            <AlertDialogAction
              className="bg-sky-700 hover:bg-slate-300 shadow-md w-full text-lg text-slate-50 hover:text-white"
              onClick={() => removerLocacao(locacaoId)}
            >
              Sim
            </AlertDialogAction>
            <AlertDialogCancel className="bg-slate-300 hover:bg-slate-300 shadow-md w-full text-lg text-slate-50 hover:text-white">
              Não
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  