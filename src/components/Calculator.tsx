import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2 } from "lucide-react"

type HistoryItem = {
    calculation: string
    result: string
}

const Calculator = () => {
    const [display, setDisplay] = useState("0")
    const [firstOperand, setFirstOperand] = useState<number | null>(null)
    const [operator, setOperator] = useState<string | null>(null)
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
    const [history, setHistory] = useState<HistoryItem[]>([])

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplay(digit)
            setWaitingForSecondOperand(false)
        } else {
            setDisplay(display === "0" ? digit : display + digit)
        }
    }

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            setDisplay("0.")
            setWaitingForSecondOperand(false)
            return
        }

        if (!display.includes(".")) {
            setDisplay(display + ".")
        }
    }

    const clearDisplay = () => {
        setDisplay("0")
        setFirstOperand(null)
        setOperator(null)
        setWaitingForSecondOperand(false)
    }

    const clearHistory = () => {
        setHistory([])
    }

    const handleOperator = (nextOperator: string) => {
        const inputValue = Number.parseFloat(display)

        if (firstOperand === null) {
            setFirstOperand(inputValue)
        } else if (operator) {
            const result = performCalculation(operator, firstOperand, inputValue)
            setDisplay(String(result))
            setFirstOperand(result)
        }

        setWaitingForSecondOperand(true)
        setOperator(nextOperator)
    }

    const performCalculation = (op: string, first: number, second: number): number => {
        switch (op) {
            case "+":
                return first + second
            case "-":
                return first - second
            case "*":
                return first * second
            case "/":
                if (second === 0) {
                    alert("Cannot divide by zero")
                    return first
                }
                return first / second
            default:
                return second
        }
    }

    const handleEquals = () => {
        if (firstOperand === null || operator === null) {
            return
        }

        const inputValue = Number.parseFloat(display)
        const result = performCalculation(operator, firstOperand, inputValue)

        const calculationString = `${firstOperand} ${operator} ${inputValue}`
        const newHistoryItem = {
            calculation: calculationString,
            result: String(result),
        }

        setHistory([newHistoryItem, ...history])
        setDisplay(String(result))
        setFirstOperand(null)
        setOperator(null)
        setWaitingForSecondOperand(false)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Calculator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 p-3 bg-gray-100 rounded-md text-right text-2xl font-mono h-14 flex items-center justify-end">
                        {display}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" onClick={clearDisplay} className="col-span-2">
                            Clear
                        </Button>
                        <Button variant="outline" onClick={() => handleOperator("/")} className="text-xl">
                            ÷
                        </Button>
                        <Button variant="outline" onClick={() => handleOperator("*")} className="text-xl">
                            ×
                        </Button>

                        <Button variant="outline" onClick={() => inputDigit("7")}>
                            7
                        </Button>
                        <Button variant="outline" onClick={() => inputDigit("8")}>
                            8
                        </Button>
                        <Button variant="outline" onClick={() => inputDigit("9")}>
                            9
                        </Button>
                        <Button variant="outline" onClick={() => handleOperator("-")} className="text-xl">
                            −
                        </Button>

                        <Button variant="outline" onClick={() => inputDigit("4")}>
                            4
                        </Button>
                        <Button variant="outline" onClick={() => inputDigit("5")}>
                            5
                        </Button>
                        <Button variant="outline" onClick={() => inputDigit("6")}>
                            6
                        </Button>
                        <Button variant="outline" onClick={() => handleOperator("+")} className="text-xl">
                            +
                        </Button>

                        <Button variant="outline" onClick={() => inputDigit("1")}>
                            1
                        </Button>
                        <Button variant="outline" onClick={() => inputDigit("2")}>
                            2
                        </Button>
                        <Button variant="outline" onClick={() => inputDigit("3")}>
                            3
                        </Button>
                        <Button variant="outline" onClick={handleEquals} className="row-span-2">
                            =
                        </Button>

                        <Button variant="outline" onClick={() => inputDigit("0")} className="col-span-2">
                            0
                        </Button>
                        <Button variant="outline" onClick={inputDecimal}>
                            .
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Calculation History</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearHistory}
                        disabled={history.length === 0}
                        title="Clear history"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[320px] pr-4">
                        {history.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No calculations yet</p>
                        ) : (
                            <ul className="space-y-2">
                                {history.map((item, index) => (
                                    <li key={index} className="border-b pb-2">
                                        <div className="text-sm text-gray-600">{item.calculation}</div>
                                        <div className="text-lg font-semibold">= {item.result}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

export default Calculator