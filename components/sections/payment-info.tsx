"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Building2, CreditCard, Smartphone } from "lucide-react"
import { useState } from "react"

export function PaymentInfo() {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const bankAccounts = [
    {
      bank: "BBVA México",
      accountNumber: "0123456789",
      clabe: "012180001234567890",
      accountHolder: "RafflePro S.A. de C.V.",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
    },
    {
      bank: "Santander México",
      accountNumber: "9876543210",
      clabe: "014180009876543210",
      accountHolder: "RafflePro S.A. de C.V.",
      icon: <CreditCard className="h-6 w-6 text-red-600" />,
    },
    {
      bank: "Banorte",
      accountNumber: "5555666677",
      clabe: "072180005555666677",
      accountHolder: "RafflePro S.A. de C.V.",
      icon: <Smartphone className="h-6 w-6 text-green-600" />,
    },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Información de Pagos</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
        </div>

        {/* Payment Instructions */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-amber-600" />
              Instrucciones de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Para confirmar tu pedido, realiza el pago y envía el comprobante de pago al número de WhatsApp donde
                fuiste redireccionado al apartar tus boletos. Si no recuerdas el número, te damos más opciones a
                continuación.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  La línea a la que fuiste dirigido anteriormente:
                </h3>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-2xl font-bold text-green-600">+52 ### ### ####</span>
                  <Button
                    onClick={() => copyToClipboard("+52 ### ### ####", "whatsapp")}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-300 hover:bg-green-50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copiedField === "whatsapp" ? "¡Copiado!" : "Copiar"}
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800 font-semibold text-center">📱 Recuerda enviar tu comprobante de pago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Transfer Information */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Información Bancaria para Transferencias
          </h2>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
              >
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {account.icon}
                    {account.bank}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Número de Cuenta
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-mono text-gray-900">{account.accountNumber}</span>
                      <Button
                        onClick={() => copyToClipboard(account.accountNumber, `account-${index}`)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      CLABE Interbancaria
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-lg font-mono text-gray-900">{account.clabe}</span>
                      <Button
                        onClick={() => copyToClipboard(account.clabe, `clabe-${index}`)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Titular de la Cuenta
                    </label>
                    <p className="text-lg text-gray-900 mt-1">{account.accountHolder}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-800">¿Necesitas Ayuda?</h3>
              <p className="text-gray-700 text-lg">
                Si tienes alguna duda sobre el proceso de pago, no dudes en contactarnos.
              </p>
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                Contactar Soporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
